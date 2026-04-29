const fs = require('fs');
const path = require('path');

// 1. Load the data source from music.json
const musicData = JSON.parse(fs.readFileSync('music.json', 'utf8'));

// Helper to create directories if they don't exist
const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const sharedStyles = `
    <style>
        body { background-color: #000; color: #fff; font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; text-align: center; }
        h1 { color: #ff5f00; text-transform: uppercase; margin-top: 10px; }
        .cyan { color: #00ffff; }
        .track-card { 
            background: #0a0a0a; border: 1px solid #1a1a1a; padding: 15px; 
            margin: 10px 0; display: flex; justify-content: space-between; 
            align-items: center; text-decoration: none; color: #fff;
        }
        .track-card:hover { border-color: #ff5f00; background: #111; }
        img { width: 100%; max-width: 400px; border: 1px solid #ff5f00; }
        audio { margin-top: 30px; width: 100%; filter: invert(1); }
        .nav-btn { display: inline-block; margin-bottom: 20px; color: #00ffff; text-decoration: none; border: 1px solid #00ffff; padding: 5px 15px; }
    </style>
`;

const trackPageTemplate = (track) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${track.title} | DoubleU</title>
    ${sharedStyles}
</head>
<body>
    <div class="container">
        <a href="index.html" class="nav-btn">BACK TO ALBUM</a>
        <br>
        <img src="${track.image_path}" alt="Artwork">
        <h1>${track.title}</h1>
        <p class="cyan">${track.album_name} — Track ${track.track_no}</p>
        <audio controls src="${track.audio_path}"></audio>
    </div>
</body>
</html>`;

const albumIndexTemplate = (albumName, tracks) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${albumName} | DoubleU</title>
    ${sharedStyles}
</head>
<body>
    <div class="container">
        <header style="padding: 40px 0;">
            <img src="${tracks[0].image_path}" style="width: 200px; margin-bottom: 20px;">
            <h1>${albumName}</h1>
        </header>
        ${tracks.sort((a, b) => a.track_no - b.track_no).map(t => `
            <a href="${t.slug}.html" class="track-card">
                <span>${t.track_no}. ${t.title}</span>
                <span class="cyan">PLAY</span>
            </a>
        `).join('')}
    </div>
</body>
</html>`;

// Filter for tracks and group them by album
const albums = musicData.reduce((acc, item) => {
    if (item.type === "Album Track") {
        if (!acc[item.album_name]) acc[item.album_name] = [];
        acc[item.album_name].push(item);
    }
    return acc;
}, {});

// Iterate through each album and create its folder at the ROOT
Object.keys(albums).forEach(albumName => {
    // Generate the URL-friendly folder name (e.g., "Dear Author" -> "dear-author")
    const folderName = albumName.toLowerCase().replace(/ /g, '-');
    
    // This creates the path at the ROOT (where your script is)
    const albumPath = path.join(__dirname, folderName);
    
    ensureDir(albumPath);

    // Write index.html to /[album-name]/index.html
    fs.writeFileSync(path.join(albumPath, 'index.html'), albumIndexTemplate(albumName, albums[albumName]));

    // Write each track page into the same root album folder
    albums[albumName].forEach(track => {
        fs.writeFileSync(path.join(albumPath, `${track.slug}.html`), trackPageTemplate(track));
    });
});

console.log("Root-level album folders generated (e.g., /dear-author/, /faded-405/).");

