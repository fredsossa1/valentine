// Get elements
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const card = document.querySelector(".card");
const successMessage = document.getElementById("successMessage");
const heartsContainer = document.getElementById("hearts");
const celebration = document.getElementById("celebration");

// ========== EMAIL NOTIFICATION CONFIG ==========
// Replace these with your EmailJS credentials from https://emailjs.com
const EMAILJS_PUBLIC_KEY = "gxXnSYzX4n0L1ypiB"; // Get from EmailJS Dashboard
const EMAILJS_SERVICE_ID = "service_zt67gct"; // e.g., "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_ai25bcf"; // e.g., "template_xyz789"

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Track "No" button attempts (only notify once)
let noAttemptNotified = false;
let yesClickNotified = false;

// Send notification email
function sendNotification(subject, message) {
  const now = new Date();
  const time = now.toLocaleString("fr-CA", {
    dateStyle: "long",
    timeStyle: "short",
  });

  emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      subject: subject,
      message: message,
      time: time,
    })
    .then(
      () => console.log("Notification sent!"),
      (error) => console.log("Failed to send:", error),
    );
}

// Create floating hearts background
function createFloatingHearts() {
  const hearts = ["💕", "💗", "💖", "💝", "❤️", "💘", "💓"];

  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 3 + Math.random() * 3 + "s";
    heart.style.fontSize = 15 + Math.random() * 20 + "px";
    heartsContainer.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => heart.remove(), 6000);
  }, 300);
}

// Make the No button run away!
function runAway(e) {
  const btn = noBtn;
  const rect = btn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;

  // Get pointer position (works for both mouse and touch)
  const pointerX = e.clientX || (e.touches && e.touches[0].clientX);
  const pointerY = e.clientY || (e.touches && e.touches[0].clientY);

  // Calculate distance from pointer to button center
  const deltaX = btnCenterX - pointerX;
  const deltaY = btnCenterY - pointerY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Only run if pointer is close enough
  if (distance < 150) {
    // Send notification on first "No" attempt
    if (!noAttemptNotified) {
      noAttemptNotified = true;
      sendNotification(
        "💔 Elle a essayé de cliquer Non !",
        "Elle a essayé de cliquer sur le bouton Non... mais il s'est enfui ! 😜",
      );
    }

    // Calculate new position (run away from pointer)
    const angle = Math.atan2(deltaY, deltaX);
    const runDistance = 150 + Math.random() * 100;

    let newX = rect.left + Math.cos(angle) * runDistance;
    let newY = rect.top + Math.sin(angle) * runDistance;

    // Keep button within viewport bounds
    const padding = 20;
    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;

    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(padding, Math.min(newY, maxY));

    // Apply fixed positioning and move
    btn.style.position = "fixed";
    btn.style.left = newX + "px";
    btn.style.top = newY + "px";
    btn.style.zIndex = "1000";
    btn.style.margin = "0";

    // Add some sass - change the text occasionally
    const sassyTexts = [
      "Non",
      "Nope !",
      "Réessaie !",
      "Tu m'auras pas !",
      "Trop lent !",
      "Hehe 😜",
      "Bien essayé !",
      "Nah !",
    ];
    btn.textContent = sassyTexts[Math.floor(Math.random() * sassyTexts.length)];
  }
}

// Desktop: Mouse events
noBtn.addEventListener("mouseenter", runAway);
noBtn.addEventListener("mousemove", runAway);

// Mobile: Touch events
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  runAway(e);
});

noBtn.addEventListener("touchmove", (e) => {
  e.preventDefault();
  runAway(e);
});

// Also make it run when pointer gets close anywhere on the document
document.addEventListener("mousemove", (e) => {
  const rect = noBtn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;
  const distance = Math.sqrt(
    Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2),
  );

  if (distance < 100) {
    runAway(e);
  }
});

// Yes button click - show celebration!
yesBtn.addEventListener("click", () => {
  // Send notification for Yes click
  if (!yesClickNotified) {
    yesClickNotified = true;
    sendNotification(
      "💖 ELLE A DIT OUI !!!",
      "Elle a cliqué sur Oui ! 🎉💕 Prépare-toi pour le 14 février !",
    );
  }

  card.classList.add("hidden");
  successMessage.classList.add("show");
  createConfetti();
});

// Create confetti celebration
function createConfetti() {
  const colors = [
    "#ff6b9d",
    "#e74c8c",
    "#ff9a9e",
    "#ffd1dc",
    "#ff69b4",
    "#ff1493",
    "#ffc0cb",
  ];
  const shapes = ["❤️", "💕", "💖", "✨", "🎉", "💗"];

  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.fontSize = 15 + Math.random() * 20 + "px";
      confetti.style.animationDelay = Math.random() * 0.5 + "s";
      celebration.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3500);
    }, i * 30);
  }
}

// Start the floating hearts
createFloatingHearts();

// Prevent accidental page refresh on mobile
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.target === noBtn) {
      e.preventDefault();
    }
  },
  { passive: false },
);
