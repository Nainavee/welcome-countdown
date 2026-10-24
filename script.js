// Dates configuration
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const FINAL_DATE = new Date(2027, 0, 6); // January 6, 2027

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MIN_MONTH_INDEX = TODAY.getFullYear() * 12 + TODAY.getMonth();
const MAX_MONTH_INDEX = FINAL_DATE.getFullYear() * 12 + FINAL_DATE.getMonth();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Sweet quotes to display
const quotes = [
  "Can't wait to see you! 💕",
  "Every day brings me closer to home 🏠",
  "Missing you and counting the days 💫",
  "We're going to have so much fun together! 🎉",
  "Just a few more days until the best reunion ever! 🌟",
  "Thinking of you always 💭",
  "Home is where you are 💕",
  "The best days are when we're together 💛",
  "See you real soon, my love! 💗",
  "Every moment counts down to our time together ✨",
];

// Events: "YYYY-MM-DD": [{ name, category }, ...]
const events = {
  // "2026-11-15": [{ name: "Assignment due", category: "Uni" }],
  // "2026-12-25": [{ name: "Christmas", category: "🎄 Special Day" }],
};

let currentMonth = TODAY.getMonth();
let currentYear = TODAY.getFullYear();

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("finalDateText").textContent =
    FINAL_DATE.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  updateCountdown();
  rotateQuote();
  generateCalendar(currentMonth, currentYear);
  updateNavButtons();

  setInterval(updateCountdown, 60000);
  setInterval(rotateQuote, 4000);

  document.getElementById("prevBtn").addEventListener("click", () => changeMonth(-1));
  document.getElementById("nextBtn").addEventListener("click", () => changeMonth(1));
});

function changeMonth(delta) {
  const idx = currentYear * 12 + currentMonth + delta;
  if (idx < MIN_MONTH_INDEX || idx > MAX_MONTH_INDEX) return;
  currentYear = Math.floor(idx / 12);
  currentMonth = idx % 12;
  generateCalendar(currentMonth, currentYear);
  updateNavButtons();
}

function updateNavButtons() {
  const idx = currentYear * 12 + currentMonth;
  document.getElementById("prevBtn").disabled = idx <= MIN_MONTH_INDEX;
  document.getElementById("nextBtn").disabled = idx >= MAX_MONTH_INDEX;
}

// Update countdown number
function updateCountdown() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // fresh each time, so it stays right overnight
  const daysDiff = Math.round((FINAL_DATE - today) / MS_PER_DAY);
  document.getElementById("countdownDays").textContent = Math.max(0, daysDiff);
}

// Rotate quotes
let currentQuoteIndex = 0;
function rotateQuote() {
  document.getElementById("quote").textContent = quotes[currentQuoteIndex];
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
}

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function calculateDaysLeft(date) {
  return Math.max(0, Math.round((FINAL_DATE - date) / MS_PER_DAY));
}

// Generate calendar for given month and year
function generateCalendar(month, year) {
  document.getElementById("monthTitle").textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  // Empty cells before month starts
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day-cell empty";
    grid.appendChild(emptyCell);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const key = toKey(year, month, day);
    const cell = document.createElement("div");
    cell.className = "day-cell";
    cell.dataset.date = key;
    cell.textContent = day;

    if (cellDate.getTime() === TODAY.getTime()) {
      cell.classList.add("today");
    } else if (cellDate < TODAY) {
      cell.classList.add("past");
    } else if (cellDate.getTime() === FINAL_DATE.getTime()) {
      cell.classList.add("final-day");
    } else if (events[key]) {
      cell.classList.add("event");
      const dot = document.createElement("div");
      dot.className = "event-dot";
      cell.appendChild(dot);
    } else {
      cell.classList.add("future");
    }

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = `${calculateDaysLeft(cellDate)} days to go`;
    cell.appendChild(tooltip);

    cell.addEventListener("mouseenter", (e) => {
      if (events[key]) showEventPopup(e.clientX, e.clientY, key);
    });
    cell.addEventListener("mousemove", (e) => {
      const popup = document.getElementById("eventPopup");
      if (popup.classList.contains("show")) positionPopup(e.clientX, e.clientY);
    });
    cell.addEventListener("mouseleave", hideEventPopup);

    grid.appendChild(cell);
  }
}

// Event popup
function positionPopup(x, y) {
  const popup = document.getElementById("eventPopup");
  const maxLeft = window.innerWidth - popup.offsetWidth - 10;
  popup.style.left = Math.max(10, Math.min(x + 10, maxLeft)) + "px";
  popup.style.top = y + 10 + "px";
}

function showEventPopup(x, y, key) {
  const list = events[key];
  if (!list) return;
  const popup = document.getElementById("eventPopup");
  document.getElementById("eventName").textContent = list.map((e) => e.name).join(" • ");
  document.getElementById("eventDaysLeft").textContent = list.map((e) => e.category).join(" • ");
  popup.classList.add("show");
  positionPopup(x, y);
}

function hideEventPopup() {
  document.getElementById("eventPopup").classList.remove("show");
}

// Touch support for mobile
let touchTimer;
document.addEventListener("touchstart", (e) => {
  const cell = e.target.closest(".day-cell");
  if (!cell || cell.classList.contains("empty")) {
    hideEventPopup();
    return;
  }
  const key = cell.dataset.date;
  if (events[key]) {
    const rect = cell.getBoundingClientRect();
    showEventPopup(rect.left + rect.width / 2, rect.top + rect.height / 2, key);
    clearTimeout(touchTimer);
    touchTimer = setTimeout(hideEventPopup, 2000);
  }
});