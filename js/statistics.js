function renderHistory() {
  const history = DB.getHistory();
  // Đảo ngược để bài mới nhất lên đầu
  const list = history.reverse();
  const container = document.getElementById("history-list");
  const emptyMsg = document.getElementById("empty-history");

  if (list.length === 0) {
    container.style.display = "none";
    emptyMsg.style.display = "block";
    return;
  }

  container.innerHTML = "";

  // Lấy thông tin topic để hiển thị avatar
  const topics = DB.getTopics();

  list.forEach((item) => {
    const topic = topics.find((t) => t.id === item.topicId);
    const topicName = topic ? topic.name : "Unknown Topic";
    const topicImg = topic
      ? topic.image || UI.generateAvatar(topic.name)
      : UI.generateAvatar("?");

    const div = document.createElement("div");
    div.className = "history-card";
    div.innerHTML = `
            <div class="history-info">
                <img src="${topicImg}" class="word-img-small" style="border-radius: 50%;">
                <div>
                    <h3 style="color: var(--text-main); margin-bottom: 5px;">${topicName}</h3>
                    <span class="badge">📅 ${item.dateTime}</span>
                    <span class="badge" style="background: #e3f2fd; color: #1976d2;">Đúng ${item.score}/${item.total}</span>
                </div>
            </div>
            
            <div style="text-align: right;">
                <div class="history-score">${item.percentage}%</div>
                <button class="btn btn-outline" style="padding: 5px 15px; font-size: 0.8rem; margin-top: 5px;" 
                    onclick="retryQuiz('${item.topicId}')">🔄 Làm lại</button>
            </div>
        `;
    container.appendChild(div);
  });
}

function retryQuiz(topicId) {
  // Chuyển hướng sang trang quiz và tự chọn topic đó
  // Chúng ta cần sửa quiz.js một chút để nhận diện URL param này
  window.location.href = `quiz.html?topicId=${topicId}`;
}

renderHistory();
