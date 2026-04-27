document.addEventListener('DOMContentLoaded', async () => {
    // 1. DATA FETCHING
    let musicData = [];
    try {
        const response = await fetch('/music.json');
        musicData = await response.json();
    } catch (e) {
        console.error("Critical: Failed to load music database.", e);
        return;
    }

    // 2. DISCOGRAPHY GRID LOGIC (music.html)
    const grid = document.getElementById('discography-grid');
    if (grid) {
        // Sort newest first
        const sortedData = [...musicData].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        const mainReleases = sortedData.filter(item => item.type === "Single" || item.type === "Album");

        grid.innerHTML = mainReleases.map(item => `
            <a href="${item.site_path}" class="group block bg-[#0a0a0a] border border-white/5 p-4 hover:border-cyan-400/50 transition-all duration-500">
                <div class="aspect-square overflow-hidden mb-6 relative">
                    <img src="${item.image_path}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110">
                </div>
                <div class="space-y-1">
                    <h3 class="font-black italic uppercase tracking-tighter text-2xl group-hover:text-cyan-400 transition-colors">${item.title}</h3>
                    <div class="flex justify-between items-center text-[9px] tracking-[0.2em] font-bold uppercase text-gray-500">
                        <span>${item.type}</span>
                        <span class="text-[#FF5F1F]">${new Date(item.release_date).getFullYear()}</span>
                    </div>
                </div>
            </a>
        `).join('');
    }

    // 3. DYNAMIC CONTENT INJECTION (single-page or album-page)
    // This looks for elements on the page with specific IDs and fills them from JSON
    const currentSlug = window.location.pathname.split('/').pop().replace('.html', '');
    const track = musicData.find(t => t.slug === currentSlug);

    if (track) {
        if (document.getElementById('track-title')) document.getElementById('track-title').innerText = track.title;
        if (document.getElementById('track-cover')) document.getElementById('track-cover').src = track.image_path;
        if (document.getElementById('audio-player')) document.getElementById('audio-player').src = track.audio_path;
        
        // Link handling
        const spotify = document.getElementById('spotify-link');
        if (spotify && track.spotify_link) spotify.href = track.spotify_link; else if (spotify) spotify.style.display = 'none';
        
        const apple = document.getElementById('apple-link');
        if (apple && track.apple_link) apple.href = track.apple_link; else if (apple) apple.style.display = 'none';
    }
});

