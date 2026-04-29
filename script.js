document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Data
    let musicData = [];
    try {
        const response = await fetch('/music.json');
        musicData = await response.json();
    } catch (e) { return; }

    // 2. Identify Current Page via Slug
    // This works for /single/dear-author or /dear-author/motel-gateway
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const currentSlug = pathParts[pathParts.length - 1];

    const track = musicData.find(t => t.slug === currentSlug);

    if (track) {
        // Update Title & Metadata
        document.title = `${track.title} | DoubleU`;
        if (document.getElementById('track-title')) document.getElementById('track-title').innerText = track.title;
        if (document.getElementById('track-cover')) document.getElementById('track-cover').src = track.image_path;
        if (document.getElementById('track-type-badge')) document.getElementById('track-type-badge').innerText = track.type;
        
        const year = track.release_date.split('-')[0];
        if (document.getElementById('track-meta')) {
            document.getElementById('track-meta').innerText = `${track.album_name || 'Single'} // ${year}`;
        }

        // Setup Audio
        const player = document.getElementById('audio-player');
        if (player && track.audio_path) {
            player.src = track.audio_path;
        } else if (player) {
            player.parentElement.style.display = 'none';
        }

        // Setup Links
        const spotify = document.getElementById('spotify-link');
        if (spotify && track.spotify_link) spotify.href = track.spotify_link;
        else if (spotify) spotify.style.display = 'none';

        const youtube = document.getElementById('youtube-link');
        if (youtube && track.youtube_link) youtube.href = track.youtube_link;
        else if (youtube) youtube.style.display = 'none';
    }
});

