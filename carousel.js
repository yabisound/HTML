const track = document.getElementById('carouselTrack');
let images = Array.from(track.children);

const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');

let currentIndex = 1;

// Clone first and last images
const firstClone = images[0].cloneNode(true);
const lastClone = images[images.length - 1].cloneNode(true);

track.insertBefore(lastClone, images[0]);
track.appendChild(firstClone);

// Re-fetch updated images array
images = Array.from(track.children);

// Set initial position
function getImageWidth() {
  return images[0].offsetWidth + 16; // margin compensation
}

function updatePosition() {
  const width = getImageWidth();
  track.style.transition = 'transform 0.5s ease-in-out';
  track.style.transform = `translateX(-${currentIndex * width}px)`;
}

function jumpToRealImage() {
  const width = getImageWidth();
  track.style.transition = 'none';
  track.style.transform = `translateX(-${currentIndex * width}px)`;
}

updatePosition();

nextButton.addEventListener('click', () => {
  if (currentIndex >= images.length - 1) return;
  currentIndex++;
  updatePosition();
});

prevButton.addEventListener('click', () => {
  if (currentIndex <= 0) return;
  currentIndex--;
  updatePosition();
});

// Handle seamless loop transition end
track.addEventListener('transitionend', () => {
  if (images[currentIndex].isEqualNode(firstClone)) {
    currentIndex = 1;
    jumpToRealImage();
  }
  if (images[currentIndex].isEqualNode(lastClone)) {
    currentIndex = images.length - 2;
    jumpToRealImage();
  }
});

// Update on resize
window.addEventListener('resize', () => {
  jumpToRealImage();
});