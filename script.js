document.addEventListener('DOMContentLoaded', async () => {
    let musicData = [];
    try {
        const response = await fetch('/music.json');
        musicData = await response.json();
    } catch (e) {
        console.error("Database Link Failure:", e);
        return;
    }

    // 1. Handle Discography Grid (music.html)
    const grid = document.getElementById('discography-grid');
    if (grid) {
        const sortedData = [...musicData].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        grid.innerHTML = sortedData.map(item => `
            <a href="${item.site_path}" class="group block glass-card p-4 hover:border-cyan-400/50 transition-all">
                <div class="aspect-square overflow-hidden mb-4 border border-white/5">
                    <img src="${item.image_path}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105">
                </div>
                <h3 class="font-black italic uppercase tracking-tighter text-2xl group-hover:text-cyan-400">${item.title}</h3>
                <p class="text-[9px] tracking-[0.2em] opacity-50 uppercase mt-1">${item.type} // ${new Date(item.release_date).getFullYear()}</p>
            </a>
        `).join('');
    }

    // 2. Dynamic Content Injection for Individual Pages
    const pathParts = window.location.pathname.split('/');
    const currentSlug = pathParts[pathParts.length - 1].replace('.html', '');
    const track = musicData.find(t => t.slug === currentSlug);

    if (track) {
        const updateEl = (id, val, attr = 'innerText') => {
            const el = document.getElementById(id);
            if (el) el[attr] = val;
        };

        updateEl('track-title', track.title);
        updateEl('track-cover', track.image_path, 'src');
        updateEl('audio-player', track.audio_path, 'src');

        const spotify = document.getElementById('spotify-link');
        if (spotify) {
            if (track.spotify_link) spotify.href = track.spotify_link;
            else spotify.style.display = 'none';
        }
    }
});

