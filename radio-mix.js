document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const audioPlayer = document.getElementById("audioPlayer");
  const waveformContainer = document.getElementById("waveformContainer");
  const waveform = document.getElementById("waveform");
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");

  let bars = [];
  let isDragging = false;

  // Generate realistic waveform bars with varying heights
  function generateWaveformBars() {
    const barCount = 100;
    
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement("div");
      bar.classList.add("wave-bar");
      
      let height;
      if (i < 10 || i > barCount - 10) {
        height = Math.random() * 30 + 10;
      } else {
        height = Math.random() * 80 + 20;
      }
      
      bar.style.height = `${height}%`;
      bar.dataset.index = i;
      waveform.appendChild(bar);
      bars.push(bar);
    }
  }

  // Handle waveform click for seeking
  function handleWaveformClick(e) {
    const rect = waveformContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * audioPlayer.duration;
    
    if (!isNaN(newTime)) {
      audioPlayer.currentTime = newTime;
      updateWaveformProgress();
    }
  }

  // Update waveform visual progress
  function updateWaveformProgress() {
    if (audioPlayer.duration) {
      const progress = audioPlayer.currentTime / audioPlayer.duration;
      const playedBars = Math.floor(progress * bars.length);
      
      bars.forEach((bar, i) => {
        if (i < playedBars) {
          bar.classList.add("played");
        } else {
          bar.classList.remove("played");
        }
      });
    }
  }

  // Format time display
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Initialize
  generateWaveformBars();

  // Event listeners
  playBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      // Change to pause unicode symbol
      playIcon.innerHTML = "⏸";
      playIcon.style.clipPath = "none";
      playIcon.style.backgroundColor = "transparent";
      playIcon.style.color = "#FAF9F6";
      playIcon.style.fontSize = "30px";
      playIcon.style.display = "flex";
      playIcon.style.alignItems = "center";
      playIcon.style.justifyContent = "center";
      playIcon.style.width = "20px";
      playIcon.style.height = "30px";
      playIcon.style.marginTop = "-8px";
      playBtn.classList.add("playing");
     
    } else {
      audioPlayer.pause();
      // Change back to play polygon
      playIcon.innerHTML = "";
      playIcon.style.clipPath = "polygon(20% 15%, 90% 50%, 20% 85%, 30% 50%)";
      playIcon.style.backgroundColor = "#FAF9F6";
      playIcon.style.color = "";
      playIcon.style.fontSize = "";
      playIcon.style.display = "inline-block";
      playIcon.style.alignItems = "";
      playIcon.style.justifyContent = "";
      playIcon.style.width = "20px";
      playIcon.style.height = "30px";
      playIcon.style.marginTop = "";
      playBtn.classList.remove("playing");
    }
  });

  audioPlayer.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
  });

  audioPlayer.addEventListener("timeupdate", () => {
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    updateWaveformProgress();
  });

  audioPlayer.addEventListener("ended", () => {
    playBtn.classList.remove("playing");
    // Reset to play polygon
    playIcon.innerHTML = "";
    playIcon.style.clipPath = "polygon(20% 15%, 90% 50%, 20% 85%, 30% 50%)";
    playIcon.style.backgroundColor = "#FAF9F6";
    playIcon.style.color = "";
    playIcon.style.fontSize = "";
    playIcon.style.display = "inline-block";
    playIcon.style.alignItems = "";
    playIcon.style.justifyContent = "";
    playIcon.style.width = "20px";
    playIcon.style.height = "30px";
    playIcon.style.marginTop = "";
  });

  // Waveform interaction
  waveformContainer.addEventListener("click", handleWaveformClick);

  // Add hover effects for better UX
  waveformContainer.addEventListener("mousemove", (e) => {
    const rect = waveformContainer.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const percentage = hoverX / rect.width;
    const hoverTime = percentage * audioPlayer.duration;
    
    waveformContainer.title = `Seek to ${formatTime(hoverTime)}`;
  });
});