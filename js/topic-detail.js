const urlParams = new URLSearchParams(window.location.search);
const currentTopicId = urlParams.get("id");

// Nếu không có ID, quay về trang topics
if (!currentTopicId) window.location.href = "topics.html";

function initDetail() {
  const topics = DB.getTopics();
  const currentTopic = topics.find((t) => t.id === currentTopicId);

  if (!currentTopic) {
    alert("Chủ đề không tồn tại!");
    window.location.href = "topics.html";
    return;
  }

  // 1. Render Header
  const header = document.getElementById("topic-header");
  const img = currentTopic.image || UI.generateAvatar(currentTopic.name);
  header.innerHTML = `
        <img src="${img}" class="topic-big-avatar">
        <div>
            <h1 style="color: var(--primary-dark);">${currentTopic.name}</h1>
            <p style="color: #666;">${currentTopic.desc}</p>
        </div>
        <button class="btn btn-outline" style="margin-left: auto;" onclick="location.href='add-word.html'">➕ Thêm từ mới</button>
    `;

  renderWordList();
}

function renderWordList() {
  const allWords = DB.getWords();
  // Lọc từ thuộc chủ đề này
  const topicWords = allWords.filter((w) => w.topicId === currentTopicId);
  const container = document.getElementById("word-list");
  container.innerHTML = "";

  if (topicWords.length === 0) {
    container.innerHTML = `<p style="color: #999;">Chưa có từ nào trong chủ đề này.</p>`;
    return;
  }

  topicWords.forEach((w) => {
    const div = document.createElement("div");
    div.className = "word-card";
    div.innerHTML = `
            <img src="${w.image}" class="word-img-small" alt="${w.en}">
            <h3 style="color: var(--text-main);">${w.en}</h3>
            <p style="color: var(--primary); font-weight: 500;">${w.vn}</p>
            
            <div class="word-actions">
                <button class="btn-icon btn-edit" title="Sửa" onclick="openEditModal(${w.id})">✏️</button>
                <button class="btn-icon btn-del" title="Xóa" onclick="deleteWord(${w.id})">🗑️</button>
            </div>
        `;
    container.appendChild(div);
  });
}

// --- CHỨC NĂNG XÓA TỪ (Không xóa chủ đề) ---
function deleteWord(id) {
  if (confirm("Bạn muốn xóa từ này khỏi chủ đề?")) {
    let allWords = DB.getWords();
    // Lọc bỏ từ có id trùng khớp
    allWords = allWords.filter((w) => w.id !== id);
    DB.saveWords(allWords);
    renderWordList(); // Render lại giao diện
  }
}

// --- CHỨC NĂNG SỬA TỪ (MODAL) ---
const modal = document.getElementById("edit-modal");

function openEditModal(id) {
  const allWords = DB.getWords();
  const word = allWords.find((w) => w.id === id);
  if (!word) return;

  // Fill dữ liệu cũ vào form
  document.getElementById("edit-id").value = word.id;
  document.getElementById("edit-en").value = word.en;
  document.getElementById("edit-vn").value = word.vn;
  document.getElementById("edit-img").value = ""; // Reset input file

  modal.style.display = "block";
}

function closeEditModal() {
  modal.style.display = "none";
}

async function saveEditWord() {
  const id = parseInt(document.getElementById("edit-id").value);
  const newEn = document.getElementById("edit-en").value;
  const newVn = document.getElementById("edit-vn").value;
  const imgFile = document.getElementById("edit-img").files[0];

  if (!newEn || !newVn) return alert("Không được để trống!");

  let allWords = DB.getWords();
  const index = allWords.findIndex((w) => w.id === id);

  if (index !== -1) {
    allWords[index].en = newEn;
    allWords[index].vn = newVn;

    // Nếu có up ảnh mới thì thay, không thì giữ ảnh cũ
    if (imgFile) {
      allWords[index].image = await DB.fileToBase64(imgFile);
    }

    DB.saveWords(allWords);
    alert("Cập nhật thành công!");
    closeEditModal();
    renderWordList();
  }
}

// Click ra ngoài để đóng modal
window.onclick = function (event) {
  if (event.target == modal) closeEditModal();
};

initDetail();
