const fs = require('fs');
const path = require('path');

// Load your local database
const musicData = JSON.parse(fs.readFileSync('./music.json', 'utf-8'));

const template = (item) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${item.title} // DoubleU</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { background: #050505; color: #eee; font-family: sans-serif; }</style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen p-6">
    <a href="/music.html" class="text-[10px] uppercase tracking-widest text-gray-600 mb-12 hover:text-white transition-colors">← Back to Catalog</a>
    
    <div class="max-w-md w-full text-center">
        <img src="${item.image_path}" class="w-full aspect-square object-cover border border-white/10 mb-8 shadow-2xl">
        <h1 class="text-6xl font-black italic uppercase tracking-tighter mb-4">${item.title}</h1>
        <p class="text-cyan-400 text-[10px] tracking-[0.5em] uppercase mb-12">${item.type} // ${item.release_date}</p>
        
        <audio controls src="${item.audio_path}" class="w-full mb-8"></audio>
        
        <div class="flex justify-center gap-6 opacity-50">
             <a href="#" class="hover:text-[#FF5F1F] font-bold text-xs">SPOTIFY</a>
             <a href="#" class="hover:text-[#FF5F1F] font-bold text-xs">APPLE</a>
             <a href="#" class="hover:text-[#FF5F1F] font-bold text-xs">YOUTUBE</a>
        </div>
    </div>
</body>
</html>`;

function build() {
    musicData.forEach(item => {
        const filePath = path.join(__dirname, item.site_path);
        const folder = path.dirname(filePath);

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        // For albums, create index.html in the folder; for singles, create the .html file
        const targetFile = item.type === "Album" ? path.join(filePath, 'index.html') : filePath;
        
        fs.writeFileSync(targetFile, template(item));
    });
    console.log("Transmission Complete: Shells Generated.");
}

build();

