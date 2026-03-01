async function fetchBlueskyPost() {
    try {
        const response = await fetch("https://api-amber-psi.vercel.app/api/fetchBluesky");
        if (!response.ok) {
            throw new Error("Failed to fetch Bluesky post");
        }
        
        const data = await response.json();
        console.log("Response Data:", data); // Log the full response for debugging

        // Check the feed exists and has posts
        const bskyDiv = document.querySelector(".bsky"); // Select by class
        let contentDiv = bskyDiv.querySelector(".bsky-content");
        if (!contentDiv) {
            contentDiv = document.createElement("div");
            contentDiv.className = "bsky-content";
            bskyDiv.appendChild(contentDiv);
        }
        contentDiv.innerHTML = "";
        
        if (data.feed && data.feed.length > 0) {
            const recentPost = data.feed[0].post;
            const postText = recentPost.record.text;
            const postAuthor = recentPost.author.displayName;
            const postCreatedAt = new Date(recentPost.createdAt);
            const timeSince = timeAgo(postCreatedAt);
            const postId = recentPost.uri.split('/').pop();
            const authorHandle = recentPost.author.handle;
            const avatarUrl = recentPost.author.avatar;
            const postUrl = `https://bsky.app/profile/${authorHandle}/post/${postId}`;

            contentDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 10px; text-align: left; margin-top: 10px;">
                    <img src="${avatarUrl}" alt="avatar" style="width: 50px; height: 50px; border-radius: 50%;">
                    <div>
                        <strong>${postAuthor}</strong> <small>@${authorHandle}</small><br>
                        <small style="opacity: 0.7;">${timeSince}</small>
                        <div style="margin: 5px 0;">${postText}</div>
                        <small><a href="${postUrl}" target="_blank">View on Bluesky</a></small>
                    </div>
                </div>
            `;
        } else {
            contentDiv.innerHTML = "<p>No posts found.</p>";
        }
    } catch (error) {
        console.error("Error:", error);
        const content = document.querySelector(".bsky-content");
        if(content) content.innerHTML = "<p>Error loading post.</p>";
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
    const lastFmDiv = document.getElementById("last-fm");
    if (!lastFmDiv) return;

    try {
        const response = await fetch("https://lastfm-api-three.vercel.app/api/lastfm"); 
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        const track = data.recenttracks.track[0];

        if (!track) {
            lastFmDiv.innerHTML = "<p>No recent tracks.</p>";
            return;
        }

        // Logic: Last.fm adds an '@attr' object if a track is currently playing
        const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
        const trackName = track.name;
        const artistName = track.artist['#text'];
        const albumCover = track.image[2]['#text'] || 'fallback-image-url.png';

        lastFmDiv.innerHTML = `
            <h3>${isPlaying ? "Now Playing" : "Recently Played"}</h3>
            <div style="display: flex; align-items: center; gap: 15px">
                <img src="${albumCover}" style="width: 100px" alt="Album Art">
                <div>
                    <strong>${trackName}</strong><br>
                    <small>${artistName}</small>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error:", error);
        lastFmDiv.innerHTML = "<p>Music status offline.</p>";
    }
}
// Call both functions when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchBlueskyPost();
    fetchLastTrack();
});





