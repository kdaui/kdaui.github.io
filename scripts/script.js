async function fetchBlueskyPost() {
    try {
        const response = await fetch("https://api-amber-psi.vercel.app/api/fetchBluesky");
        if (!response.ok) throw new Error("Failed to fetch Bluesky post");
        
        const data = await response.json();
        const bskyDiv = document.querySelector(".bsky"); 
        bskyDiv.innerHTML = "<h3>Bsky-ing</h3>"; 

        if (data.feed && data.feed.length > 0) {
            const recentPost = data.feed[0].post;
            
            // Try different possible date fields from the Bluesky API
            const rawDate = recentPost.record?.createdAt || recentPost.indexedAt || recentPost.createdAt;
            const postCreatedAt = new Date(rawDate);
            const timeSince = timeAgo(postCreatedAt);

            const postText = recentPost.record.text;
            const postAuthor = recentPost.author.displayName;
            const postId = recentPost.uri.split('/').pop(); 
            const authorHandle = recentPost.author.handle;
            const avatarUrl = recentPost.author.avatar;
            const postUrl = `https://bsky.app/profile/${authorHandle}/post/${postId}`;

            bskyDiv.innerHTML += `
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <img src="${avatarUrl}" alt="${postAuthor}'s avatar" style="width:40px; height:40px; border-radius:50%; margin-right:10px;">
                    <div>
                        <strong>${postAuthor}</strong> • 
                        <small title="${postCreatedAt.toLocaleString()}">${timeSince}</small>
                        <div>${postText}</div>
                        <small><a href="${postUrl}" target="_blank">View Post</a></small>
                    </div>
                </div>
            `;
        } else {
            bskyDiv.innerHTML += "<p>No posts found.</p>";
        }
    } catch (error) {
        console.error("Error loading post:", error);
        document.querySelector(".bsky").innerHTML = "<h3>Bsky-ing</h3><p>Error loading post.</p>";
    }
}

function timeAgo(date) {
    if (!date || isNaN(date.getTime())) {
        return "recently";
    }

    const formatter = new Intl.RelativeTimeFormat('en', {
        numeric: 'auto', 
        style: 'long',
    });

    const DIVISIONS = [
        { amount: 60, name: 'second' },
        { amount: 60, name: 'minute' },
        { amount: 24, name: 'hour' },
        { amount: 7, name: 'day' },
        { amount: 4.34524, name: 'week' },
        { amount: 12, name: 'month' },
        { amount: Infinity, name: 'year' }
    ];

    let duration = (date - new Date()) / 1000;

    for (const division of DIVISIONS) {
        if (Math.abs(duration) < division.amount) {
            return formatter.format(Math.round(duration), division.name);
        }
        duration /= division.amount;
    }
    
    return "some time ago"; // Final fallback
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

        const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
        
        let timeDisplay = ""; 
        if (isPlaying) {
            timeDisplay = "Listening right now";
        } else if (track.date && track.date.uts) {
            const lastPlayedDate = new Date(track.date.uts * 1000);
            timeDisplay = `Last played ${timeAgo(lastPlayedDate)}`;
        }

        const trackName = track.name;
        const artistName = track.artist['#text'];
        const albumCover = track.image[2]['#text'] || '/assets/images/fallback-image-url.png';

        lastFmDiv.innerHTML = `
            <h3>${isPlaying ? "Now Playing" : "Recently Played"}</h3>
            <div style="display: flex; align-items: center; gap: 15px">
                <img src="${albumCover}" style="width: 80px; border-radius: 8px;" alt="Album Art">
                <div>
                    <div style="font-weight: bold;">${trackName}</div>
                    <div style="font-size: 0.9em; opacity: 0.8;">${artistName}</div>
                    <div style="font-size: 0.8em; color: #888; margin-top: 4px;">${timeDisplay}</div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error:", error);
        lastFmDiv.innerHTML = "<h3>Music</h3><p>Status offline.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchBlueskyPost();
    fetchLastTrack();
});


