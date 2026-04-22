// Dates configuration
const TODAY = new Date();
const FINAL_DATE = new Date(2026, 5, 21); // June 21, 2026

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

// Events configuration
const events = {
  "2026-04-19": { name: "Assignment 1", category: "PF - Assignment 1" },
  "2026-04-19-ds": {
    name: "Practical Assignment 1",
    category: "DS - Assignment 1",
  },
  "2026-04-21": { name: "Mom's Birthday", category: "🎂 Special Day" },
  "2026-04-26": { name: "Reflection 1", category: "AI - Reflection 1" },
  "2026-05-03": { name: "Micro-Credential", category: "AI - Micro Credential" },
  "2026-05-11-dm": { name: "Written Test 2", category: "DM - Test 2" },
  "2026-05-11-pf": {
    name: "A2 Milestone Check",
    category: "PF - A2 Milestone",
  },
  "2026-05-18": {
    name: "Practical Assignment 2",
    category: "DS - Assignment 2",
  },
  "2026-05-17": { name: "Project Proposal", category: "AI - Project Proposal" },
  "2026-05-25": { name: "Assignment 2 Code", category: "PF - A2 Code" },
  "2026-05-31": { name: "Reflection 2", category: "AI - Reflection 2" },
  "2026-06-01": {
    name: "Assignment 2 Presentation",
    category: "PF - A2 Presentation",
  },
  "2026-06-04": { name: "Group Assignment", category: "DM - Group Assignment" },
  "2026-06-07": { name: "Final Test", category: "AI - Final Test" },
  "2026-06-08": { name: "Virtual Presentation", category: "DS - Presentation" },
  "2026-06-15-dm": {
    name: "Online Invigilated Assignment",
    category: "DM - Final Test",
  },
  "2026-06-15-pf": {
    name: "Invigilated Timed Test",
    category: "PF - Final Test",
  },
};

let currentMonth = TODAY.getMonth();
let currentYear = TODAY.getFullYear();

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateCountdown();
  rotateQuote();
  generateCalendar(currentMonth, currentYear);

  // Update countdown every minute
  setInterval(updateCountdown, 60000);

  // Rotate quotes every 4 seconds
  setInterval(rotateQuote, 4000);

  // Setup navigation
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentMonth === 3 && currentYear === 2026) return; // Don't go before April 2026
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentMonth === 5 && currentYear === 2026) return; // Don't go after June 2026
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
  });
});

// Update countdown number
function updateCountdown() {
  // const now = new Date();
  const timeDiff = FINAL_DATE - TODAY;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  document.getElementById("countdownDays").textContent = Math.max(0, daysDiff);
}

// Rotate quotes with animation
let currentQuoteIndex = 0;
function rotateQuote() {
  const quoteElement = document.getElementById("quote");
  quoteElement.textContent = quotes[currentQuoteIndex];
  currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
}

// Generate calendar for given month and year
function generateCalendar(month, year) {
  // Update month title
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  document.getElementById("monthTitle").textContent =
    `${monthNames[month]} ${year}`;

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Clear grid
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day-cell empty";
    grid.appendChild(emptyCell);
  }

  // Add day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const cell = document.createElement("div");
    cell.className = "day-cell";
    cell.textContent = day;

    // Determine cell type
    if (cellDate.toDateString() === TODAY.toDateString()) {
      cell.classList.add("today");
    } else if (cellDate < TODAY) {
      cell.classList.add("past");
    } else if (cellDate.toDateString() === FINAL_DATE.toDateString()) {
      cell.classList.add("final-day");
    } else if (isEventDate(year, month, day)) {
      cell.classList.add("event");
      // Add event indicator dot
      const dot = document.createElement("div");
      dot.className = "event-dot";
      cell.appendChild(dot);
    } else {
      cell.classList.add("future");
    }

    // Add tooltip with days left
    const daysLeft = calculateDaysLeft(cellDate);
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = `${daysLeft} days to go`;
    cell.appendChild(tooltip);

    // Add hover event handling for event popup
    cell.addEventListener("mouseenter", (e) => {
      const eventKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (events[eventKey]) {
        showEventPopup(e, eventKey);
      }
    });

    cell.addEventListener("mousemove", (e) => {
      const popup = document.getElementById("eventPopup");
      if (popup.classList.contains("show")) {
        popup.style.left = e.pageX + 10 + "px";
        popup.style.top = e.pageY + 10 + "px";
      }
    });

    cell.addEventListener("mouseleave", hideEventPopup);

    grid.appendChild(cell);
  }
}

// Check if date has an event
function isEventDate(year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Check exact matches
  if (events[dateStr]) return true;

  // Check for dates with multiple events (like 2026-05-11-dm, 2026-05-11-pf)
  for (let key in events) {
    if (key.startsWith(dateStr)) return true;
  }

  return false;
}

// Calculate days left from given date to final date
function calculateDaysLeft(date) {
  const timeDiff = FINAL_DATE - date;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
}

// Show event popup
function showEventPopup(event, eventKey) {
  const popup = document.getElementById("eventPopup");
  const eventName = document.getElementById("eventName");
  const eventDaysLeft = document.getElementById("eventDaysLeft");

  if (events[eventKey]) {
    eventName.textContent = events[eventKey].name;
    eventDaysLeft.textContent = events[eventKey].category;

    popup.classList.add("show");
    popup.style.left = event.pageX + 10 + "px";
    popup.style.top = event.pageY + 10 + "px";
  }
}

// Hide event popup
function hideEventPopup() {
  const popup = document.getElementById("eventPopup");
  popup.classList.remove("show");
}

// Touch support for mobile
document.addEventListener("touchstart", (e) => {
  const target = e.target.closest(".day-cell");
  if (target && !target.classList.contains("empty")) {
    const rect = target.getBoundingClientRect();
    const eventKey = getEventKeyFromCell(target);
    if (eventKey && events[eventKey]) {
      showEventPopup(
        {
          pageX: rect.left + rect.width / 2,
          pageY: rect.top + rect.height / 2,
        },
        eventKey,
      );
    }
  }
});

// Get event key from calendar cell
function getEventKeyFromCell(cell) {
  const monthTitle = document.getElementById("monthTitle").textContent;
  const monthPart = monthTitle.split(" ")[0];
  const yearPart = monthTitle.split(" ")[1];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let month = monthNames.indexOf(monthPart) + 1;
  let year = parseInt(yearPart);
  let day = parseInt(cell.textContent);

  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Check for exact and variant keys
  if (events[dateStr]) return dateStr;
  for (let key in events) {
    if (key.startsWith(dateStr)) return key;
  }

  return null;
}
