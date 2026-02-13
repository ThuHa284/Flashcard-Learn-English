/* js/common.js */

// --- 1. Quản lý Dữ liệu (LocalStorage) ---
const DB = {
  init: () => {
    if (!localStorage.getItem("pe_topics")) {
      const defaultTopics = [
        { id: "t1", name: "Animals", desc: "Thế giới động vật", image: "" },
        { id: "t2", name: "Food", desc: "Đồ ăn thức uống", image: "" },
      ];
      localStorage.setItem("pe_topics", JSON.stringify(defaultTopics));
    }
    if (!localStorage.getItem("pe_words")) {
      const defaultWords = [
        {
          id: 1,
          topicId: "t1",
          en: "Cat",
          vn: "Con mèo",
          image: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
        },
        {
          id: 2,
          topicId: "t1",
          en: "Dog",
          vn: "Con chó",
          image: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
        },
        {
          id: 3,
          topicId: "t2",
          en: "Apple",
          vn: "Quả táo",
          image: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
        },
      ];
      localStorage.setItem("pe_words", JSON.stringify(defaultWords));
    }
    // Khởi tạo lịch sử nếu chưa có
    if (!localStorage.getItem("pe_history")) {
      localStorage.setItem("pe_history", JSON.stringify([]));
    }
  },
  getTopics: () => JSON.parse(localStorage.getItem("pe_topics")) || [],
  getWords: () => JSON.parse(localStorage.getItem("pe_words")) || [],
  getHistory: () => JSON.parse(localStorage.getItem("pe_history")) || [], // Mới thêm

  saveTopics: (data) => localStorage.setItem("pe_topics", JSON.stringify(data)),
  saveWords: (data) => localStorage.setItem("pe_words", JSON.stringify(data)),
  saveHistory: (data) =>
    localStorage.setItem("pe_history", JSON.stringify(data)), // Mới thêm

  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  },
};

// --- 2. Giao diện (UI) ---
const UI = {
  generateAvatar: (text, size = 100) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const grd = ctx.createLinearGradient(0, 0, size, size);
    grd.addColorStop(0, "#ffdde1");
    grd.addColorStop(1, "#ee9ca7");

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size / 2}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2 + 5);

    return canvas.toDataURL();
  },

  // --- CẬP NHẬT MENU SIDEBAR TẠI ĐÂY ---
  renderSidebar: () => {
    const sidebar = document.getElementById("sidebar-container");
    if (!sidebar) return;

    const path = window.location.pathname;
    // Hàm kiểm tra active (nếu đang ở trang đó thì tô màu)
    const isActive = (p) => (path.includes(p) ? "active" : "");

    sidebar.innerHTML = `
            <div class="brand">
                <span>🌸</span>
                <span class="nav-text">Pinky English</span>
            </div>
            <nav>
                <a href="index.html" class="nav-item ${isActive("index.html")}">
                    <span class="nav-icon">🏠</span> <span class="nav-text">Trang chủ</span>
                </a>
                
                <!-- Mục Quản lý Chủ đề (Active khi ở trang topics hoặc trang chi tiết) -->
                <a href="topics.html" class="nav-item ${isActive("topics.html") || isActive("topic-detail.html") ? "active" : ""}">
                    <span class="nav-icon">📚</span> <span class="nav-text">Quản lý Chủ đề</span>
                </a>
                
                <a href="add-word.html" class="nav-item ${isActive("add-word.html")}">
                    <span class="nav-icon">✍️</span> <span class="nav-text">Thêm từ vựng</span>
                </a>
                
                <a href="study.html" class="nav-item ${isActive("study.html")}">
                    <span class="nav-icon">🧠</span> <span class="nav-text">Học Flashcard</span>
                </a>
                
                <a href="quiz.html" class="nav-item ${isActive("quiz.html")}">
                    <span class="nav-icon">❓</span> <span class="nav-text">Kiểm tra Quiz</span>
                </a>

                <!-- 👇 MỤC THỐNG KÊ ĐƯỢC THÊM VÀO ĐÂY 👇 -->
                <a href="statistics.html" class="nav-item ${isActive("statistics.html")}">
                    <span class="nav-icon">📊</span> <span class="nav-text">Thống kê</span>
                </a>
            </nav>
        `;
  },
};

// Khởi chạy
DB.init();
document.addEventListener("DOMContentLoaded", UI.renderSidebar);
