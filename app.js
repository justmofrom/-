const QUALITY_TAGS = [
  "✓ Accurate（准确）",
  "✗ Inaccurate（不准确）",
  "✗ Off-topic（跑题）",
  "✗ Fabricated info（编造信息）",
  "✓ Helpful（有帮助）",
  "✓ Empathetic（有同情心）",
  "✗ Poor attitude（态度差）",
  "✗ Unclear（不清楚）",
  "✓ Complete answer（完整回答）"
];

const state = {
  conversations: [],
  annotations: {},
  currentIndex: 0
};

const els = {
  fileInput: document.getElementById("fileInput"),
  loadSampleBtn: document.getElementById("loadSampleBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  progress: document.getElementById("progress"),
  conversationId: document.getElementById("conversationId"),
  userMessage: document.getElementById("userMessage"),
  assistantMessage: document.getElementById("assistantMessage"),
  tagContainer: document.getElementById("tagContainer"),
  notes: document.getElementById("notes"),
  saveBtn: document.getElementById("saveBtn"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  status: document.getElementById("status")
};

function setStatus(message) {
  els.status.textContent = message;
}

function getUserAssistant(conversation) {
  const user = (conversation.turns || []).find((t) => t.role === "user");
  const assistant = (conversation.turns || []).find((t) => t.role === "assistant");
  return {
    userMessage: user?.content || "",
    assistantMessage: assistant?.content || ""
  };
}

function getCurrentConversation() {
  return state.conversations[state.currentIndex];
}

function ensureAnnotation(id) {
  if (!state.annotations[id]) {
    state.annotations[id] = {
      tags: [],
      notes: "",
      timestamp: ""
    };
  }
  return state.annotations[id];
}

function saveCurrentAnnotation() {
  const conversation = getCurrentConversation();
  if (!conversation) return;

  const checked = [...els.tagContainer.querySelectorAll("input[type='checkbox']:checked")];
  const tags = checked.map((cb) => cb.value);
  const notes = els.notes.value.trim();
  const annotation = ensureAnnotation(conversation.id);

  annotation.tags = tags;
  annotation.notes = notes;
  annotation.timestamp = new Date().toISOString();
  setStatus(`已保存会话 ${conversation.id} 的标注`);
}

function renderTags(selectedTags = []) {
  els.tagContainer.innerHTML = "";
  QUALITY_TAGS.forEach((tag) => {
    const label = document.createElement("label");
    label.className = "tag";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = tag;
    checkbox.checked = selectedTags.includes(tag);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(tag));
    els.tagContainer.appendChild(label);
  });
}

function renderCurrent() {
  const total = state.conversations.length;
  if (!total) {
    els.progress.textContent = "0 / 0";
    els.conversationId.textContent = "-";
    els.userMessage.textContent = "-";
    els.assistantMessage.textContent = "-";
    renderTags([]);
    els.notes.value = "";
    return;
  }

  const conversation = getCurrentConversation();
  const { userMessage, assistantMessage } = getUserAssistant(conversation);
  const annotation = ensureAnnotation(conversation.id);

  els.progress.textContent = `${state.currentIndex + 1} / ${total}`;
  els.conversationId.textContent = conversation.id || "";
  els.userMessage.textContent = userMessage;
  els.assistantMessage.textContent = assistantMessage;
  renderTags(annotation.tags);
  els.notes.value = annotation.notes || "";
}

function loadConversations(data) {
  if (!Array.isArray(data)) {
    throw new Error("JSON 根节点必须是数组");
  }
  state.conversations = data;
  state.currentIndex = 0;
  renderCurrent();
  setStatus(`已加载 ${data.length} 条会话`);
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildExportRows() {
  return state.conversations.map((conversation) => {
    const { userMessage, assistantMessage } = getUserAssistant(conversation);
    const annotation = state.annotations[conversation.id] || {};
    return {
      conversation_id: conversation.id || "",
      user_message: userMessage,
      assistant_response: assistantMessage,
      quality_tags: (annotation.tags || []).join(" | "),
      annotation_timestamp: annotation.timestamp || "",
      annotator_notes: annotation.notes || ""
    };
  });
}

function exportJson() {
  saveCurrentAnnotation();
  const rows = buildExportRows();
  downloadFile("annotations.json", JSON.stringify(rows, null, 2), "application/json");
  setStatus("已导出 JSON");
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function exportCsv() {
  saveCurrentAnnotation();
  const rows = buildExportRows();
  const headers = Object.keys(rows[0] || {
    conversation_id: "",
    user_message: "",
    assistant_response: "",
    quality_tags: "",
    annotation_timestamp: "",
    annotator_notes: ""
  });
  const csvLines = [headers.join(",")];
  rows.forEach((row) => {
    csvLines.push(headers.map((h) => escapeCsvValue(row[h])).join(","));
  });
  downloadFile("annotations.csv", csvLines.join("\n"), "text/csv;charset=utf-8");
  setStatus("已导出 CSV");
}

async function loadSample() {
  const response = await fetch("./sample-data.json");
  const data = await response.json();
  loadConversations(data);
}

els.fileInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    loadConversations(data);
  } catch (error) {
    setStatus(`文件加载失败：${error.message}`);
  }
});

els.loadSampleBtn.addEventListener("click", () => {
  loadSample().catch((error) => setStatus(`示例数据加载失败：${error.message}`));
});

els.prevBtn.addEventListener("click", () => {
  if (state.currentIndex <= 0) return;
  saveCurrentAnnotation();
  state.currentIndex -= 1;
  renderCurrent();
});

els.nextBtn.addEventListener("click", () => {
  if (state.currentIndex >= state.conversations.length - 1) return;
  saveCurrentAnnotation();
  state.currentIndex += 1;
  renderCurrent();
});

els.saveBtn.addEventListener("click", saveCurrentAnnotation);
els.exportJsonBtn.addEventListener("click", exportJson);
els.exportCsvBtn.addEventListener("click", exportCsv);

loadSample().catch((error) => setStatus(`示例数据加载失败：${error.message}`));
