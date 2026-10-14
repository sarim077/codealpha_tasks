/**
 * Task 4: Music Player using JavaScript
 * Features:
 * - HTML5 Audio control (play, pause, next, previous)
 * - Track metadata display (song title, artist, genre, live duration/current time)
 * - Interactive draggable/clickable progress bar
 * - Volume slider and instant mute toggle
 * - Playlist management with click-to-play
 * - Autoplay next track on end
 * - Shuffle mode & Repeat track/playlist mode
 * - Rotating vinyl animation + Sound wave equalizer visualizer
 */

const playlist = [
  {
    title: "Cyberpunk Chill Synth",
    artist: "Neon Skyline",
    genre: "Synthwave / Lo-Fi",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Midnight Drive",
    artist: "Solaris",
    genre: "Electronic / Ambient",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Cosmic Horizon",
    artist: "Aether Pulse",
    genre: "Deep Melodic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Dream State Acoustic",
    artist: "Echoes of Silence",
    genre: "Chillstep",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80"
  }
];

// Elements
const audio = document.getElementById("audioElement");
const discRecord = document.getElementById("discRecord");
const albumArt = document.getElementById("albumArt");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");
const trackGenre = document.getElementById("trackGenre");
const visualizer = document.getElementById("visualizer");

const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const progressContainer = document.getElementById("progressContainer");
const progressFill = document.getElementById("progressFill");
const progressScrubber = document.getElementById("progressScrubber");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");

const volumeSlider = document.getElementById("volumeSlider");
const volumeIcon = document.getElementById("volumeIcon");
const volumePct = document.getElementById("volumePct");
const muteBtn = document.getElementById("muteBtn");

const playlistToggleBtn = document.getElementById("playlistToggleBtn");
const playlistModal = document.getElementById("playlistModal");
const playlistItems = document.getElementById("playlistItems");
const playlistCount = document.getElementById("playlistCount");

// States
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let previousVolume = 0.8;

// Format seconds into MM:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Load Song
function loadTrack(index) {
  currentTrackIndex = index;
  const track = playlist[currentTrackIndex];

  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  trackGenre.textContent = track.genre;
  albumArt.src = track.cover;
  audio.src = track.src;

  updatePlaylistActive();
}

// Play / Pause toggle
function togglePlayPause() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function playTrack() {
  isPlaying = true;
  audio.play().then(() => {
    playIcon.classList.remove("fa-play");
    playIcon.classList.add("fa-pause");
    discRecord.classList.add("playing");
    visualizer.classList.add("active");
  }).catch((err) => {
    console.log("Playback error or user interaction needed:", err);
  });
}

function pauseTrack() {
  isPlaying = false;
  audio.pause();
  playIcon.classList.remove("fa-pause");
  playIcon.classList.add("fa-play");
  discRecord.classList.remove("playing");
  visualizer.classList.remove("active");
}

// Next / Previous
function nextTrack() {
  if (isShuffle) {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } while (nextIndex === currentTrackIndex && playlist.length > 1);
    currentTrackIndex = nextIndex;
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  }
  loadTrack(currentTrackIndex);
  playTrack();
}

function prevTrack() {
  if (audio.currentTime > 3) {
    // If more than 3 seconds in, restart track
    audio.currentTime = 0;
    return;
  }
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

// Update Progress Bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  if (!duration) return;

  const percent = (currentTime / duration) * 100;
  progressFill.style.width = `${percent}%`;
  progressScrubber.style.left = `${percent}%`;

  currentTimeEl.textContent = formatTime(currentTime);
  durationTimeEl.textContent = formatTime(duration);
}

// Seek scrubber
function setProgress(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (!duration) return;

  audio.currentTime = (clickX / width) * duration;
}

// Volume & Mute
function setVolume(e) {
  const val = parseFloat(e.target.value);
  audio.volume = val;
  updateVolumeUI(val);
}

function updateVolumeUI(val) {
  volumePct.textContent = `${Math.round(val * 100)}%`;
  if (val === 0) {
    volumeIcon.className = "fa-solid fa-volume-xmark";
  } else if (val < 0.5) {
    volumeIcon.className = "fa-solid fa-volume-low";
  } else {
    volumeIcon.className = "fa-solid fa-volume-high";
  }
}

function toggleMute() {
  if (audio.volume > 0) {
    previousVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
  } else {
    audio.volume = previousVolume || 0.8;
    volumeSlider.value = audio.volume;
  }
  updateVolumeUI(audio.volume);
}

// Build Playlist UI
function renderPlaylist() {
  playlistItems.innerHTML = "";
  playlistCount.textContent = `${playlist.length} Songs`;

  playlist.forEach((track, idx) => {
    const item = document.createElement("div");
    item.className = `playlist-item ${idx === currentTrackIndex ? "active" : ""}`;
    item.dataset.index = idx;

    item.innerHTML = `
      <div class="item-left">
        <img src="${track.cover}" class="item-thumb" alt="${track.title}">
        <div class="item-info">
          <span class="item-title">${track.title}</span>
          <span class="item-artist">${track.artist}</span>
        </div>
      </div>
      <div class="item-duration"><i class="fa-solid fa-play" style="font-size: 0.75rem;"></i></div>
    `;

    item.addEventListener("click", () => {
      loadTrack(idx);
      playTrack();
    });

    playlistItems.appendChild(item);
  });
}

function updatePlaylistActive() {
  const items = document.querySelectorAll(".playlist-item");
  items.forEach((item, idx) => {
    if (idx === currentTrackIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Event Listeners
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", () => {
  durationTimeEl.textContent = formatTime(audio.duration);
});

// Autoplay behavior when song ends
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playTrack();
  } else {
    nextTrack();
  }
});

// Progress seek
progressContainer.addEventListener("click", setProgress);

// Volume Controls
volumeSlider.addEventListener("input", setVolume);
muteBtn.addEventListener("click", toggleMute);

// Shuffle & Repeat buttons
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

// Toggle Playlist Drawer
playlistToggleBtn.addEventListener("click", () => {
  playlistModal.classList.toggle("open");
  playlistToggleBtn.classList.toggle("active");
});

// Keyboard hotkeys
window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") {
    e.preventDefault();
    togglePlayPause();
  } else if (e.code === "ArrowRight") {
    nextTrack();
  } else if (e.code === "ArrowLeft") {
    prevTrack();
  }
});

// Initialize on page load
audio.volume = 0.8;
loadTrack(0);
renderPlaylist();
