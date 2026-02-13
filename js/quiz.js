let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;

function initQuiz() {
  const topics = DB.getTopics();
  const select = document.getElementById("quiz-topic-select");

  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedTopic = urlParams.get("topicId");

  function initQuiz() {
    const topics = DB.getTopics();
    const select = document.getElementById("quiz-topic-select");

    // ... (code tạo option cũ giữ nguyên) ...
    // Thêm đoạn dưới đây sau khi tạo options:

    if (preSelectedTopic) {
      select.value = preSelectedTopic;
    }
  }
  // Add "All" option
  const allOpt = document.createElement("option");
  allOpt.value = "all";
  allOpt.innerText = "Tất cả chủ đề";
  select.appendChild(allOpt);

  topics.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.innerText = t.name;
    select.appendChild(opt);
  });
}

function startQuiz() {
  const topicId = document.getElementById("quiz-topic-select").value;
  const allWords = DB.getWords();
  let pool = [];

  if (topicId === "all") pool = allWords;
  else pool = allWords.filter((w) => w.topicId === topicId);

  if (pool.length < 4) return alert("Cần ít nhất 4 từ để bắt đầu Quiz!");

  // Shuffle and pick max 10
  quizQuestions = pool.sort(() => 0.5 - Math.random()).slice(0, 10);
  quizIndex = 0;
  quizScore = 0;

  document.getElementById("quiz-setup").style.display = "none";
  document.getElementById("quiz-play").style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  if (quizIndex >= quizQuestions.length) return finishQuiz();

  const currentQ = quizQuestions[quizIndex];
  const allWords = DB.getWords();

  document.getElementById("q-progress").innerText =
    `Câu ${quizIndex + 1}/${quizQuestions.length}`;
  document.getElementById("q-question").innerText = currentQ.en;
  document.getElementById("q-img").src = currentQ.image;

  // Generate Options: 1 Correct + 3 Wrong
  let options = [currentQ];
  let wrongPool = allWords.filter((w) => w.id !== currentQ.id);
  let wrongs = wrongPool.sort(() => 0.5 - Math.random()).slice(0, 3);
  options = options.concat(wrongs);
  options.sort(() => 0.5 - Math.random()); // Shuffle options

  const optContainer = document.getElementById("q-options");
  optContainer.innerHTML = "";

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline";
    btn.style.width = "100%";
    btn.innerText = opt.vn;
    btn.onclick = () => checkAnswer(opt.id, currentQ.id);
    optContainer.appendChild(btn);
  });
}

function checkAnswer(selectedId, correctId) {
  if (selectedId === correctId) {
    quizScore++;
    alert("✅ Chính xác!");
  } else {
    alert("❌ Sai rồi!");
  }
  quizIndex++;
  loadQuestion();
}

function finishQuiz() {
  document.getElementById("quiz-play").style.display = "none";
  document.getElementById("quiz-result").style.display = "block";

  // Hiển thị điểm số UI
  document.getElementById("final-score").innerText =
    `${quizScore}/${quizQuestions.length}`;

  // --- LOGIC MỚI: LƯU LỊCH SỬ ---
  const topicId = document.getElementById("quiz-topic-select").value;
  const percentage = Math.round((quizScore / quizQuestions.length) * 100);
  const now = new Date();
  const dateString = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;

  const newRecord = {
    id: Date.now(),
    topicId: topicId === "all" ? "all" : topicId, // Xử lý nếu chọn tất cả
    score: quizScore,
    total: quizQuestions.length,
    percentage: percentage,
    dateTime: dateString,
  };

  const currentHistory = DB.getHistory();
  currentHistory.push(newRecord);
  DB.saveHistory(currentHistory);
}

initQuiz();
