const topicSelect = document.getElementById("select-topic");
const inpEn = document.getElementById("inp-en");
const inpImg = document.getElementById("inp-img");
const prevEn = document.getElementById("prev-en");
const prevImg = document.getElementById("prev-img");

// Load danh sách chủ đề vào Select
function loadTopics() {
  const topics = DB.getTopics();
  topicSelect.innerHTML = "";
  topics.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.innerText = t.name;
    topicSelect.appendChild(opt);
  });
}

// Live Preview
inpEn.addEventListener("input", () => {
  prevEn.innerText = inpEn.value || "English";
});

inpImg.addEventListener("change", async () => {
  if (inpImg.files && inpImg.files[0]) {
    const base64 = await DB.fileToBase64(inpImg.files[0]);
    prevImg.src = base64;
    prevImg.style.display = "block";
  }
});

async function saveWord() {
  const topicId = topicSelect.value;
  const en = inpEn.value;
  const vn = document.getElementById("inp-vn").value;

  if (!topicId) return alert("Vui lòng tạo chủ đề trước!");
  if (!en || !vn) return alert("Vui lòng nhập đủ thông tin!");

  let image = "";
  // Nếu có ảnh upload thì dùng, không thì tạo avatar từ chữ
  if (inpImg.files && inpImg.files[0]) {
    image = await DB.fileToBase64(inpImg.files[0]);
  } else {
    image = UI.generateAvatar(en);
  }

  const words = DB.getWords();
  words.push({
    id: Date.now(),
    topicId,
    en,
    vn,
    image,
  });

  DB.saveWords(words);
  alert("Đã lưu thành công! ✨");

  // Reset form
  inpEn.value = "";
  document.getElementById("inp-vn").value = "";
  inpImg.value = "";
  prevEn.innerText = "English";
  prevImg.style.display = "none";
}

loadTopics();
