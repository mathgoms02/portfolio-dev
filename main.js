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
const slideTextBox = document.querySelectorAll(".slide-text");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let counter = 0;
let size = items[0].getBoundingClientRect().width;

// Initial Position
slide.style.transform = "translateX(0px)";
slideTextBox[0].classList.add("fade-in");

window.addEventListener("resize", () => {
  size = items[0].getBoundingClientRect().width;
  slide.style.transform = `translateX(${-size * counter}px)`;
});

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

  const currentText = document.querySelector(`.sl${counter + 1}`);
  const lastText = document.querySelector(`.sl${counter}`);

  slide.style.transform = `translateX(${-size * counter}px)`;

  lastText.classList.add("fade-out");
  currentText.classList.add("fade-in");

  setTimeout(() => {
    lastText.classList.remove("fade-in");
    lastText.classList.remove("fade-out");
  }, 500);
});

prevBtn.addEventListener("click", () => {
  if (counter <= 0) return;
  counter--;

  const currentText = document.querySelector(`.sl${counter + 1}`);
  const lastText = document.querySelector(`.sl${counter + 2}`);

  slide.style.transform = `translateX(${-size * counter}px)`;

  lastText.classList.add("fade-out");
  currentText.classList.add("fade-in");

  setTimeout(() => {
    lastText.classList.remove("fade-in");
    lastText.classList.remove("fade-out");
  }, 500);
});
