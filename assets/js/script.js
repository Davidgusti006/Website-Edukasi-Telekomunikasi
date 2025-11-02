document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const hamburger = document.getElementById("hamburger");
  const menu = document.querySelector("nav .menu");

  // Toggle menu mobile
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    menu.classList.toggle("show");
  });

  // Tutup menu saat klik link (mobile)
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("show")) {
        menu.classList.remove("show");
        hamburger.classList.remove("active");
      }
    });
  });

  // Navbar berubah saat scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // Set active menu berdasarkan halaman (SPA)
  function setActiveMenu(page) {
    menu.querySelectorAll("a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("onclick")?.includes(page));
    });
  }

  // Override showPage untuk set active menu
  const originalShowPage = window.showPage;
  window.showPage = function (page) {
    originalShowPage(page);
    setActiveMenu(page);
  };

  // Set active menu awal
  setActiveMenu("home");
});

// === Dark Mode Toggle ===
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector("#darkModeToggle");
  const body = document.body;

  // cek preferensi sebelumnya
  if (localStorage.getItem("darkMode") === "true") {
    body.classList.add("dark-mode");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    body.classList.toggle("dark-mode", toggle.checked);
    localStorage.setItem("darkMode", toggle.checked);
  });
});

// Ambil semua card materi
const materiCards = document.querySelectorAll("#materi .card");

materiCards.forEach((card) => {
  card.addEventListener("click", () => {
    // Sembunyikan semua materi detail
    document.querySelectorAll(".materi-detail").forEach((m) => m.classList.add("hidden"));

    // Ambil id target materi dari teks card
    const title = card.textContent.trim();
    if (title.includes("Pengenalan")) {
      document.getElementById("materi-pengenalan").classList.remove("hidden");
    } else if (title.includes("OSI")) {
      document.getElementById("materi-osi").classList.remove("hidden");
    } else if (title.includes("Fiber")) {
      document.getElementById("materi-fiber").classList.remove("hidden");
    } else if (title.includes("5G")) {
      document.getElementById("materi-5g").classList.remove("hidden");
    } else if (title.includes("IoT")) {
      document.getElementById("materi-iot").classList.remove("hidden");
    }

    // Scroll otomatis ke detail
    document.querySelector(".materi-detail:not(.hidden)").scrollIntoView({ behavior: "smooth" });
  });
});

// --- DATA SOAL ---
const questions = [
  {
    question: "Protokol apa yang digunakan untuk mengirim email?",
    options: ["SMTP", "HTTP", "FTP", "DNS"],
    answer: "SMTP",
  },
  {
    question: "Lapisan OSI yang bertanggung jawab untuk routing adalah?",
    options: ["Data Link", "Transport", "Network", "Session"],
    answer: "Network",
  },
  {
    question: "Alamat unik perangkat dalam jaringan disebut?",
    options: ["IP Address", "URL", "Port", "Subnet"],
    answer: "IP Address",
  },
];

let currentQuestion = 0;
let score = 0;
let answeredCount = 0;

function updateQuizProgress() {
  const fill = document.getElementById("quiz-progress-fill");
  const text = document.getElementById("quiz-progress-text");
  const total = questions.length;

  const percent = (answeredCount / total) * 100;

  if (fill) fill.style.width = percent + "%";
  if (text) text.textContent = `${answeredCount}/${total}`;
}

// --- TAMPILKAN SOAL ---
function loadQuestion() {
  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("next-home").classList.add("hidden");

  const q = questions[currentQuestion];
  document.getElementById("question-text").innerText = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  optionsDiv.classList.remove("answered");

  q.options.forEach((opt) => {
    const btn = document.createElement("div");
    btn.className = "quiz-option";
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("result").classList.add("hidden");
  updateQuizProgress();
}

// --- CEK JAWABAN ---
function checkAnswer(answer) {
  const q = questions[currentQuestion];
  const optionsDiv = document.getElementById("options");
  if (optionsDiv.classList.contains("answered")) return; // sudah dijawab → jangan ulangi
  optionsDiv.classList.add("answered");

  answeredCount++;
  updateQuizProgress();

  // Highlight jawaban
  Array.from(optionsDiv.children).forEach((btn) => {
    btn.style.pointerEvents = "none";
    if (btn.innerText === q.answer) btn.classList.add("correct");
    if (btn.innerText === answer && answer !== q.answer) btn.classList.add("incorrect");
  });

  // Hitung skor
  if (answer === q.answer) {
    score++;
    document.getElementById("result").innerText = "Benar!";
  } else {
    document.getElementById("result").innerText = "Salah!";
  }
  document.getElementById("result").classList.remove("hidden");

  // Kontrol tombol navigasi
  if (currentQuestion < questions.length - 1) {
    // Masih ada soal → munculkan tombol Next
    document.getElementById("next-btn").classList.remove("hidden");
    document.getElementById("next-home").classList.add("hidden");
  } else {
    // Sudah soal terakhir → langsung tampilkan hasil
    showResult();
  }
}

// --- SOAL BERIKUTNYA ---
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult(); // kalau sudah habis, jangan biarkan tombol next nongol
  }
}

// --- TAMPILKAN HASIL ---
function showResult() {
  document.getElementById("next-btn").classList.add("hidden"); // pastikan Next disembunyikan
  document.getElementById("next-home").classList.remove("hidden");

  document.getElementById("question-text").innerText = `🎉 Kuis selesai! Skor kamu: ${score}/${questions.length}`;
  document.getElementById("options").innerHTML = "";
  document.getElementById("result").classList.add("hidden");
  updateQuizProgress();
  startConfetti();
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  answeredCount = 0;

  document.getElementById("result").classList.add("hidden");
  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("next-home").classList.add("hidden");
  document.getElementById("question-text").innerText = "";
  document.getElementById("options").innerHTML = "";
  updateQuizProgress();
}

// --- CONFETTI ---
function startConfetti() {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 10,
      h: 10,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speed: Math.random() * 3 + 2,
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      p.y += p.speed;
      if (p.y > canvas.height) p.y = -10;
    });
  }
  function animate() {
    draw();
    requestAnimationFrame(animate);
  }
  animate();
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
  }, 5000);
}

// --- EVENT LISTENER ---
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("quiz")) {
    loadQuestion();
  }
  const nextHomeBtn = document.getElementById("next-home");
  if (nextHomeBtn) {
    nextHomeBtn.addEventListener("click", () => {
      resetQuiz();
    });
  }
});

// --- SHOWPAGE (SPA) ---
function showPage(page) {
  document.querySelectorAll(".container > div").forEach((div) => div.classList.add("hidden"));
  document.getElementById(page).classList.remove("hidden");
  if (page === "quiz") {
    resetQuiz();
    loadQuestion();
  }
}

// --- FORM MASUKAN ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    fetch("https://web3forms.com/api/v1/submit", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Feedback submitted successfully!");
          form.reset();
        } else {
          alert("Error submitting feedback.");
        }
      });
  });
});
// --- END FORM MASUKAN ---
