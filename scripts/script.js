async function fetchBlueskyPost() {
    try {
        const response = await fetch("https://api-amber-psi.vercel.app/api/fetchBluesky");
        if (!response.ok) {
            throw new Error("Failed to fetch Bluesky post");
        }
        
        const data = await response.json();
        console.log("Response Data:", data); // Log the full response for debugging

        // Ensure the feed exists and has posts
        const bskyDiv = document.querySelector(".bsky"); // Select by class
        bskyDiv.innerHTML = "<h3>Bsky-ing</h3>"; // Keep the title

        if (data.feed && data.feed.length > 0) {
            // Get the most recent post
            const recentPost = data.feed[0].post;

            // Extract relevant information
            const postText = recentPost.record.text;
            const postAuthor = recentPost.author.displayName;
            const postCreatedAt = new Date(recentPost.createdAt);
            const timeSince = timeAgo(postCreatedAt);
            const postId = recentPost.uri.split('/').pop(); // Get the post ID
            const authorHandle = recentPost.author.handle;
            const avatarUrl = recentPost.author.avatar;

            // Create a web-compatible Bluesky URL
            const postUrl = `https://bsky.app/profile/${authorHandle}/post/${postId}`;

            // Append post content under the title
            bskyDiv.innerHTML += `
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <img src="${avatarUrl}" alt="${postAuthor}'s avatar"">
                    <div>
                        <strong>${postAuthor}</strong> • 
                        <small title="${postCreatedAt.toLocaleString()}">${timeSince}</small>
                        <div>${postText}</div>
                        <small><a href="${postUrl}" target="_blank">View Post</a></small>
                    </div>
                </div>
            `;
        } else {
            console.error("No posts found in the feed.");
            bskyDiv.innerHTML += "<p>No posts found.</p>";
        }
    } catch (error) {
        console.error("Error loading post:", error);
        document.querySelector(".bsky").innerHTML = "<h3>Bsky-ing</h3><p>Error loading post.</p>";
    }
}

// Function to calculate time since the post was created
function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    return `${seconds} seconds ago`;
}

async function fetchLastTrack() {
    try {
        // URL of the text file containing the Last.fm API link
        const fileUrl = 'https://lastfm-api-three.vercel.app/lastfm_url.txt ';
        
        // Fetch the content of the text file
        const fileResponse = await fetch(fileUrl);
        const apiUrl = await fileResponse.text();  // Read the content of the text file

        // Ensure lastFmDiv exists
        const lastFmDiv = document.getElementById("last-fm");
        if (!lastFmDiv) {
            console.error("Element with ID 'last-fm' not found.");
            return;
        }

        // Fetch data from the API link obtained from the text file
        const response = await fetch(apiUrl.trim());
        if (!response.ok) {
            throw new Error("Failed to fetch Last.fm data");
        }

        const data = await response.json();
        console.log("Response Data:", data); // Log the full response for debugging

        // Ensure the recent tracks exist
        if (data.recenttracks.track && data.recenttracks.track.length > 0) {
            // Get the most recent track
            const recentTrack = data.recenttracks.track[0];
            // Check if the track is currently playing or was recently played
            const isPlaying = !recentTrack.date; 

            // Extract relevant information
            const trackName = recentTrack.name;
            const artistName = recentTrack.artist['#text'];
            const albumCover = recentTrack.image[2]['#text']; // Medium size image

            // Append track content under the title
            lastFmDiv.innerHTML = `
                <h3>Now Playing</h3>
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <img src="${albumCover}" alt="${artistName}'s album cover" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px; margin-right: 15px;">
                    <div>
                        <strong style="font-size: 1.2em;">${trackName}</strong><br>
                        <small style="font-size: 1.1em;">${artistName}</small>
                    </div>
                </div>
                ${isPlaying ? '<p>Currently playing!</p>' : '<p>Just listened to this track.</p>'}
            `;
        } else {
            console.error("No recent tracks found.");
            lastFmDiv.innerHTML = "<h3>Now Playing</h3><p>No recent tracks found.</p>";
        }
    } catch (error) {
        console.error("Error loading Last.fm data:", error);
        document.getElementById("last-fm").innerHTML = "<h3>Now Playing</h3><p>Error loading data.</p>";
    }
}

// Call both functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchBlueskyPost();
    fetchLastTrack();
});
