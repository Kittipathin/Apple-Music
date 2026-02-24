const albumGrid = document.getElementById('album-grid');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const videoPlayer = document.getElementById('music-video-player');
const playerCover = document.getElementById('player-cover');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playBtn = document.getElementById('play-btn');

let isPlaying = false;

async function fetchAppleMusic(searchTerm) {
    try {
        albumGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #8e8e93;">กำลังค้นหา...</p>';
        
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&limit=200&entity=song`);
        const data = await response.json();
        
        albumGrid.innerHTML = ''; 
        
        if(data.results.length === 0) {
            albumGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #8e8e93;">ไม่พบเพลงที่ค้นหา ลองพิมพ์ชื่อศิลปิน หรือชื่อเพลงใหม่ดูนะครับ</p>';
            return;
        }

        let validTracks = data.results.filter(track => track.artworkUrl100 && track.previewUrl);

        validTracks.sort((a, b) => {
            const albumA = a.collectionName || "";
            const albumB = b.collectionName || "";
            
            if (albumA < albumB) return -1;
            if (albumA > albumB) return 1;
            
            return (a.trackNumber || 0) - (b.trackNumber || 0);
        });

        validTracks.forEach(track => {
            const highResImage = track.artworkUrl100.replace('100x100bb', '600x600bb');
            const card = document.createElement('div');
            card.className = 'album-card';
            
            card.innerHTML = `
                <img src="${highResImage}" alt="Cover">
                <h4 class="album-title">${track.trackNumber}. ${track.trackName}</h4>
                <p class="artist-name">${track.collectionName}</p>
            `;
            
            card.addEventListener('click', () => {
                document.querySelector('.video-container').scrollIntoView({ behavior: 'smooth' });
                videoPlayer.src = track.previewUrl;
                videoPlayer.poster = highResImage;
                videoPlayer.play();

                playerCover.src = highResImage;
                playerTitle.textContent = track.trackName;
                playerArtist.textContent = track.artistName; 
                
                playBtn.textContent = '⏸';
                isPlaying = true;
            });
            
            albumGrid.appendChild(card);
        });
    } catch (error) {
        console.error("Error:", error);
        albumGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #fa243c;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    }
}

searchBtn.addEventListener('click', () => {
    const term = searchInput.value.trim();
    if (term !== '') {
        fetchAppleMusic(term);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const term = searchInput.value.trim();
        if (term !== '') {
            fetchAppleMusic(term);
        }
    }
});

playBtn.addEventListener('click', () => {
    if (!videoPlayer.src) return; 

    if (isPlaying) {
        videoPlayer.pause();
        playBtn.textContent = '▶';
    } else {
        videoPlayer.play();
        playBtn.textContent = '⏸';
    }
    isPlaying = !isPlaying;
});

videoPlayer.addEventListener('ended', () => {
    isPlaying = false;
    playBtn.textContent = '▶';
});

fetchAppleMusic('Avenged Sevenfold');