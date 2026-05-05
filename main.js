// Navbar
const navBarLinks = document.querySelector("#navbar-links");
const navbar = document.querySelector(".navbar-container");
const hambMenu = document.querySelector(".hamb-menu i");

function openHambMenu() {
  navBarLinks.classList.toggle("active");
  hambMenu.classList.toggle("rotate");
}

navBarLinks.addEventListener("click", (e) => {
  const isMobile = window.innerWidth <= 768;

  if (e.target.tagName === "A") {
    e.preventDefault();

    const targetId = e.target.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const navbarHeight = navbar.offsetHeight;
      const coord =
        targetSection.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;
      window.scrollTo({
        top: isMobile ? coord : coord + 50,
        behavior: "smooth",
      });

      navBarLinks.classList.remove("active");
    }
  }
});

// TypeWrites Variables
const textElement = document.querySelector(".adj-box");
const words = [
  "a Fullstack Developer",
  "an Automation Engineer",
  "a Data Engineer",
  "a Machine Learning Engineer",
  "an AI Developer",
  "a Software Engineer",
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

// Typewriter
function typewriter() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    textElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    textElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 150;

  if (!isDeleting && charIndex === currentWord.length) {
    // Pause
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Next word
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length; // Volta para o inicio da lista
    typeSpeed = 500;
  }
  setTimeout(typewriter, typeSpeed);
}

// DOMContentLoaded event to when initial html is loaded
document.addEventListener("DOMContentLoaded", typewriter);

// Carrousel Variabels
const carouselTrack = document.querySelector(".carousel-slide");
const slides = document.querySelectorAll(".slide");
const slideTexts = document.querySelectorAll(".slide-text");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const dotsContainer = document.querySelector(".carousel-guide-dot");

let currentIndex = 0;
let slideWidth = slides[0].getBoundingClientRect().width;

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

window.addEventListener(
  "resize",
  debounce(() => {
    slideWidth = slides[0].getBoundingClientRect().width;
    carouselTrack.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
  }),
);

// Carrousel
function initCarousel() {
  // Initial Position
  carouselTrack.style.transform = "translateX(0px)";
  slideTexts[0].classList.add("fade-in");

  createDots();
  updateDots(0);
}

let dots = [];

function createDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement("i");
    dot.classList.add("fa-solid", "fa-circle", "dot");
    dotsContainer.appendChild(dot);
    dot.dataset.index = index;

    dot.addEventListener("click", (e) => {
      const index = Number(e.target.dataset.index);

      if (index === currentIndex) return;

      updateCarousel(index);
    });
  });
  dots = document.querySelectorAll(".dot");
}

function updateDots(index) {
  dots.forEach((dot) => dot.classList.remove("dot-active"));
  dots[index].classList.add("dot-active");
}

function moveSlide() {
  carouselTrack.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
}

function updateCarousel(newIndex) {
  const lastIndex = currentIndex;
  currentIndex = newIndex;

  moveSlide();

  slideTexts[lastIndex].classList.add("fade-out");
  slideTexts[currentIndex].classList.add("fade-in");

  setTimeout(() => {
    slideTexts[lastIndex].classList.remove("fade-in");
    slideTexts[lastIndex].classList.remove("fade-out");
  }, 500);

  updateDots(currentIndex);
}

nextBtn.addEventListener("click", () => {
  if (currentIndex < slides.length - 1) {
    updateCarousel(currentIndex + 1);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    updateCarousel(currentIndex - 1);
  }
});

initCarousel();
