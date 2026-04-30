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

// Carrousel Variabels
const slide = document.querySelector(".carousel-slide");
const items = document.querySelectorAll(".slide");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let counter = 0;
const size = items[0].getBoundingClientRect().width;

// Initial Position
slide.style.transform = "translateX(0px)";

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
    // Next workd
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length; // Volta para o inicio da lista
    typeSpeed = 500;
  }

  setTimeout(typewriter, typeSpeed);
}
// DOMContentLoaded Dispara quando o html inicial é carregado
document.addEventListener("DOMContentLoaded", typewriter);

// Carrousel
nextBtn.addEventListener("click", () => {
  if (counter >= items.length - 1) return;
  counter++;
  slide.style.transform = `translateX(${-size * counter}px)`;
});

prevBtn.addEventListener("click", () => {
  if (counter <= 0) return;
  counter--;
  slide.style.transform = `translateX(${-size * counter}px)`;
});
