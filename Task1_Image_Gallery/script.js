/**
 * Task 1: Image Gallery & Lightbox Viewer
 * Features:
 * - Dynamic rendering with high-res photography
 * - Category filter animation (All, Nature, Architecture, Tech, Travel)
 * - Lightbox modal with next/prev buttons and counter
 * - Keyboard navigation (Escape, ArrowLeft, ArrowRight)
 * - Smooth fade-in transitions & image preloading
 */

const galleryData = [
  {
    id: 1,
    title: "Misty Mountain Peaks",
    category: "nature",
    desc: "Ethereal sunrise rays cutting through alpine mountain mist.",
    thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=90"
  },
  {
    id: 2,
    title: "Cyberpunk Metropolis",
    category: "architecture",
    desc: "Futuristic skyscrapers glowing under vibrant neon lights.",
    thumb: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=90"
  },
  {
    id: 3,
    title: "Quantum Processor Core",
    category: "tech",
    desc: "Intricate microchip circuitry glowing with blue laser luminescence.",
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=90"
  },
  {
    id: 4,
    title: "Venetian Grand Canal",
    category: "travel",
    desc: "Historic Italian architecture reflecting over dusk waterways.",
    thumb: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=90"
  },
  {
    id: 5,
    title: "Emerald Forest Cascades",
    category: "nature",
    desc: "Cascading rainforest waterfalls enclosed in dense moss foliage.",
    thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=90"
  },
  {
    id: 6,
    title: "Curvilinear Glass Spiral",
    category: "architecture",
    desc: "Modern parametric museum structure with spiral staircase geometry.",
    thumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=90"
  },
  {
    id: 7,
    title: "Holographic Neural Matrix",
    category: "tech",
    desc: "Data science visualization representing deep neural weights.",
    thumb: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=90"
  },
  {
    id: 8,
    title: "Kyoto Golden Hour Alley",
    category: "travel",
    desc: "Traditional lantern-lit wooden machiya houses in Gion, Kyoto.",
    thumb: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=90"
  }
];

// Elements
const galleryGrid = document.getElementById("galleryGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const lightbox = document.getElementById("lightbox");
const lightboxOverlay = document.getElementById("lightboxOverlay");
const lightboxImg = document.getElementById("lightboxImg");
const metaCategory = document.getElementById("metaCategory");
const metaTitle = document.getElementById("metaTitle");
const metaDesc = document.getElementById("metaDesc");
const itemCounter = document.getElementById("itemCounter");
const downloadBtn = document.getElementById("downloadBtn");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const imageSpinner = document.getElementById("imageSpinner");

// State
let currentFilter = "all";
let activeItems = [...galleryData];
let currentIndex = 0;

// Render gallery
function renderGallery() {
  galleryGrid.innerHTML = "";
  galleryData.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.dataset.category = item.category;
    card.dataset.id = item.id;

    card.innerHTML = `
      <img src="${item.thumb}" alt="${item.title}" loading="lazy">
      <div class="card-overlay">
        <span class="card-tag">${item.category}</span>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-meta">Click to expand preview</p>
      </div>
    `;

    card.addEventListener("click", () => {
      openLightbox(item.id);
    });

    galleryGrid.appendChild(card);
  });
}

// Filter function
function filterGallery(category) {
  currentFilter = category;
  
  if (category === "all") {
    activeItems = [...galleryData];
  } else {
    activeItems = galleryData.filter(item => item.category === category);
  }

  const cards = document.querySelectorAll(".gallery-card");
  cards.forEach(card => {
    if (category === "all" || card.dataset.category === category) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
}

// Lightbox modal logic
function openLightbox(itemId) {
  // Find index in current activeItems
  const index = activeItems.findIndex(item => item.id === itemId);
  if (index === -1) {
    currentIndex = 0;
  } else {
    currentIndex = index;
  }

  updateLightboxContent();
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateLightboxContent() {
  if (activeItems.length === 0) return;
  
  const currentItem = activeItems[currentIndex];
  
  // Show spinner
  imageSpinner.style.display = "block";
  lightboxImg.style.opacity = "0.3";

  // Preload image
  const imgObj = new Image();
  imgObj.src = currentItem.full;
  imgObj.onload = () => {
    lightboxImg.src = currentItem.full;
    lightboxImg.alt = currentItem.title;
    lightboxImg.style.opacity = "1";
    imageSpinner.style.display = "none";
  };

  metaCategory.textContent = currentItem.category.toUpperCase();
  metaTitle.textContent = currentItem.title;
  metaDesc.textContent = currentItem.desc;
  itemCounter.textContent = `${currentIndex + 1} / ${activeItems.length}`;
  downloadBtn.href = currentItem.full;
}

function showNext() {
  if (activeItems.length === 0) return;
  currentIndex = (currentIndex + 1) % activeItems.length;
  updateLightboxContent();
}

function showPrev() {
  if (activeItems.length === 0) return;
  currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length;
  updateLightboxContent();
}

// Event Listeners
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterGallery(btn.dataset.filter);
  });
});

closeBtn.addEventListener("click", closeLightbox);
lightboxOverlay.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrev);

// Keyboard controls
window.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  
  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowRight") {
    showNext();
  } else if (e.key === "ArrowLeft") {
    showPrev();
  }
});

// Initialize
renderGallery();
