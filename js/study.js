let currentList = [];
let currentIndex = 0;
const cardInner = document.getElementById("card-inner");

function initStudy() {
  const topics = DB.getTopics();
  const select = document.getElementById("study-topic-select");

  topics.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.innerText = t.name;
    select.appendChild(opt);
  });

  loadCards();
}

function loadCards() {
  const topicId = document.getElementById("study-topic-select").value;
  const allWords = DB.getWords();
  const topics = DB.getTopics();

  if (topicId === "all") {
    currentList = allWords;
  } else {
    currentList = allWords.filter((w) => w.topicId === topicId);
  }

  if (currentList.length === 0) {
    document.getElementById("study-area").style.display = "none";
    document.getElementById("empty-msg").style.display = "block";
  } else {
    document.getElementById("study-area").style.display = "block";
    document.getElementById("empty-msg").style.display = "none";
    currentIndex = 0;
    showCard();
  }
}

function showCard() {
  const word = currentList[currentIndex];
  const topics = DB.getTopics();
  const topicName =
    topics.find((t) => t.id === word.topicId)?.name || "Unknown";

  document.getElementById("card-en").innerText = word.en;
  document.getElementById("card-vn").innerText = word.vn;
  document.getElementById("card-img").src = word.image;
  document.getElementById("card-topic").innerText = topicName;
  document.getElementById("progress-text").innerText =
    `${currentIndex + 1} / ${currentList.length}`;

  // Reset flip
  cardInner.classList.remove("is-flipped");
}

function flipCard() {
  cardInner.classList.toggle("is-flipped");
}

function nextCard() {
  if (currentIndex < currentList.length - 1) {
    currentIndex++;
    showCard();
  } else {
    alert("Đã hết danh sách! 🎉");
  }
}

function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    showCard();
  }
}

initStudy();
