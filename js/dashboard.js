// Hiển thị thống kê đơn giản
const topics = DB.getTopics();
const words = DB.getWords();

document.getElementById("total-topics").innerText = topics.length;
document.getElementById("total-words").innerText = words.length;
