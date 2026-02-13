function renderTopics() {
  const list = DB.getTopics();
  const container = document.getElementById("topics-list");
  container.innerHTML = "";

  list.forEach((t) => {
    // Nếu không có ảnh, tạo avatar tự động
    const img = t.image || UI.generateAvatar(t.name);

    // Đếm số từ trong chủ đề này
    const count = DB.getWords().filter((w) => w.topicId === t.id).length;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div onclick="location.href='topic-detail.html?id=${t.id}'" style="cursor: pointer;">
            <img src="${img}" class="card-avatar" alt="${t.name}">
            <h3>${t.name}</h3>
            <p style="color: #666; font-size: 0.9em;">${t.desc}</p>
            <p style="margin-top: 10px; font-weight: bold; color: var(--primary);">${count} từ vựng</p>
        </div>
        <!-- Giữ nút xóa chủ đề ở ngoài div click để tránh xung đột -->
        <button class="btn btn-danger" style="margin-top: 15px; padding: 5px 15px; font-size: 0.8em;" onclick="deleteTopic('${t.id}')">Xóa Chủ Đề</button>
    `;
    container.appendChild(card);
  });
}

function addTopic() {
  const name = document.getElementById("topic-name").value;
  const desc = document.getElementById("topic-desc").value;

  if (!name) return alert("Vui lòng nhập tên chủ đề!");

  const topics = DB.getTopics();
  topics.push({
    id: "t" + Date.now(),
    name,
    desc,
    image: "", // Có thể mở rộng upload ảnh sau
  });

  DB.saveTopics(topics);
  document.getElementById("topic-name").value = "";
  document.getElementById("topic-desc").value = "";
  renderTopics();
}

function deleteTopic(id) {
  if (
    confirm(
      "Bạn có chắc chắn xóa? Tất cả từ vựng trong chủ đề này cũng sẽ mất!",
    )
  ) {
    let topics = DB.getTopics().filter((t) => t.id !== id);
    let words = DB.getWords().filter((w) => w.topicId !== id);

    DB.saveTopics(topics);
    DB.saveWords(words);
    renderTopics();
  }
}

// Chạy lần đầu
renderTopics();
