document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  const logoContainer = document.querySelector('.logo-container');
  const teaser = document.getElementById('teaserOverlay');
  const video = document.getElementById('teaserVideo');
  const mainContent = document.getElementById('mainContent');
  
  if (!logo || !teaser || !mainContent || !logoContainer || !video) {
    console.error('One or more required elements not found');
    return;
  }
  
  function getExactLogoPosition() {
    const logoRect = logo.getBoundingClientRect();
    return {
      top: logoRect.top,
      left: logoRect.left,
      width: logoRect.width,
      height: logoRect.height
    };
  }
  
  // Create a clone of the logo to show during video playback
  const logoClone = logo.cloneNode(true);
  logoClone.classList.add('logo-clone');
  
  // Configure the logo clone's initial position and style
  function updateLogoClone() {
    const logoPos = getExactLogoPosition();
    
    logoClone.style.position = 'fixed';
    logoClone.style.top = '1rem';  // Match the original logo's top position
    logoClone.style.left = '1rem'; // Match the original logo's left position
    logoClone.style.width = logoPos.width + 'px';
    logoClone.style.height = logoPos.height + 'px';
    logoClone.style.zIndex = '1002'; // Above the video overlay
    logoClone.style.display = 'none';
    logoClone.style.cursor = 'pointer';
  }
  
  updateLogoClone();
  document.body.appendChild(logoClone);
  
  // Update the position when the window is resized
  window.addEventListener('resize', updateLogoClone);
  window.addEventListener('scroll', updateLogoClone);
  
  let isVideoPlaying = false;
  
  // Function to toggle video playback
  function toggleVideo() {
    if (isVideoPlaying) {
      // Stop the video
      video.pause();
      video.currentTime = 0;
      teaser.classList.remove('active');
      mainContent.classList.remove('hidden');
      logoClone.style.display = 'none';
      isVideoPlaying = false;
    } else {
      // Play the video
      teaser.classList.add('active');
      mainContent.classList.add('hidden');
      logoClone.style.display = 'block';
      
      // Unmute if the user has interacted with the page
      if (document.body.classList.contains('user-interacted')) {
        video.muted = false;
      }
      
      // Try to play the video
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isVideoPlaying = true;
          })
          .catch(err => {
            console.warn('Video playback failed:', err);
            isVideoPlaying = false;
          });
      }
    }
  }
  
  // Handle click on the original logo
  logo.addEventListener('click', (e) => {
    // Mark that the user has interacted with the page (for audio)
    document.body.classList.add('user-interacted');
    toggleVideo();
  });
  
  // Handle click on the cloned logo (to stop the video)
  logoClone.addEventListener('click', (e) => {
    toggleVideo();
  });
  
  // Auto-mute the video initially
  video.muted = true;
  
  // Allow unmuting after user interaction with the page
  document.addEventListener('click', () => {
    document.body.classList.add('user-interacted');
    
    // If the video is already playing, unmute it
    if (isVideoPlaying) {
      video.muted = false;
    }
  }, { once: true });
});