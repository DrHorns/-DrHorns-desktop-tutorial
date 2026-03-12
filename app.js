const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const list = document.getElementById("todo-list");
const emptyMsg = document.getElementById("empty-msg");
const themeToggle = document.getElementById("theme-toggle");
const taskCount = document.getElementById("task-count");
const clearDoneBtn = document.getElementById("clear-done");
const filterBtns = document.querySelectorAll(".filter-btn:not(#clear-done)");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
let dragIndex = null;

// Theme
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") document.body.classList.add("light");
updateThemeIcon();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const theme = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("theme", theme);
  updateThemeIcon();
});

function updateThemeIcon() {
  const isLight = document.body.classList.contains("light");
  themeToggle.innerHTML = isLight ? "&#9728;" : "&#9790;";
}

// Filters
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Clear completed
clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  render();
  save();
});

function getFilteredTodos() {
  if (currentFilter === "active") return todos.filter((t) => !t.done);
  if (currentFilter === "done") return todos.filter((t) => t.done);
  return todos;
}

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateEmptyMsg(filtered) {
  emptyMsg.classList.toggle("hidden", filtered.length > 0);
}

function updateTaskCount() {
  const remaining = todos.filter((t) => !t.done).length;
  taskCount.textContent = remaining === 1 ? "1 task left" : `${remaining} tasks left`;

  const doneCount = todos.filter((t) => t.done).length;
  clearDoneBtn.style.display = doneCount > 0 ? "" : "none";
}

function formatDueDate(dateStr) {
  const due = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24));

  let label;
  if (diffDays < 0) label = `Overdue by ${Math.abs(diffDays)}d`;
  else if (diffDays === 0) label = "Due today";
  else if (diffDays === 1) label = "Due tomorrow";
  else label = `Due ${due.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;

  let className = "due-date";
  if (diffDays < 0) className += " overdue";
  else if (diffDays === 0) className += " due-today";

  return { label, className };
}

function startEdit(contentEl, todo) {
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = todo.text;
  contentEl.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  function finishEdit() {
    const newText = editInput.value.trim();
    if (newText) {
      todo.text = newText;
      save();
    }
    render();
  }

  editInput.addEventListener("blur", finishEdit);
  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") editInput.blur();
    if (e.key === "Escape") {
      editInput.value = todo.text;
      editInput.blur();
    }
  });
}

function animateRemove(li, callback) {
  li.classList.add("removing");
  li.addEventListener("animationend", callback, { once: true });
}

function renderTodo(todo) {
  const realIndex = todos.indexOf(todo);
  const li = document.createElement("li");
  li.dataset.index = realIndex;
  if (todo.done) li.classList.add("done");

  // Drag handle
  const handle = document.createElement("span");
  handle.className = "drag-handle";
  handle.textContent = "\u2261";
  handle.title = "Drag to reorder";

  // Make draggable
  li.draggable = true;
  li.addEventListener("dragstart", (e) => {
    dragIndex = realIndex;
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });
  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
    dragIndex = null;
    list.querySelectorAll("li").forEach((el) => el.classList.remove("drag-over"));
  });
  li.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    list.querySelectorAll("li").forEach((el) => el.classList.remove("drag-over"));
    li.classList.add("drag-over");
  });
  li.addEventListener("dragleave", () => {
    li.classList.remove("drag-over");
  });
  li.addEventListener("drop", (e) => {
    e.preventDefault();
    li.classList.remove("drag-over");
    const dropIndex = parseInt(li.dataset.index);
    if (dragIndex !== null && dragIndex !== dropIndex) {
      const [moved] = todos.splice(dragIndex, 1);
      todos.splice(dropIndex, 0, moved);
      save();
      render();
    }
  });

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.done;
  checkbox.addEventListener("change", () => {
    todos[realIndex].done = checkbox.checked;
    render();
    save();
  });

  const contentEl = document.createElement("div");
  contentEl.className = "todo-content";
  contentEl.title = "Double-click to edit";

  const textSpan = document.createElement("span");
  textSpan.className = "todo-text";
  textSpan.textContent = todo.text;
  contentEl.appendChild(textSpan);

  if (todo.dueDate) {
    const { label, className } = formatDueDate(todo.dueDate);
    const dueBadge = document.createElement("span");
    dueBadge.className = className;
    dueBadge.textContent = label;
    contentEl.appendChild(dueBadge);
  }

  contentEl.addEventListener("dblclick", () => {
    startEdit(contentEl, todo);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "\u00d7";
  deleteBtn.title = "Delete";
  deleteBtn.addEventListener("click", () => {
    animateRemove(li, () => {
      todos.splice(realIndex, 1);
      render();
      save();
    });
  });

  li.append(handle, checkbox, contentEl, deleteBtn);
  return li;
}

function render() {
  list.innerHTML = "";
  const filtered = getFilteredTodos();
  filtered.forEach((todo) => list.appendChild(renderTodo(todo)));
  updateEmptyMsg(filtered);
  updateTaskCount();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const dueDate = dateInput.value || null;
  todos.push({ text, done: false, dueDate });
  input.value = "";
  dateInput.value = "";
  render();
  save();
});

render();
