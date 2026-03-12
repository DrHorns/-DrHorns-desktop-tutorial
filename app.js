const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMsg = document.getElementById("empty-msg");
const themeToggle = document.getElementById("theme-toggle");
const taskCount = document.getElementById("task-count");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

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
}

function renderTodo(todo) {
  const realIndex = todos.indexOf(todo);
  const li = document.createElement("li");
  if (todo.done) li.classList.add("done");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.done;
  checkbox.addEventListener("change", () => {
    todos[realIndex].done = checkbox.checked;
    render();
    save();
  });

  const span = document.createElement("span");
  span.textContent = todo.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "\u00d7";
  deleteBtn.title = "Delete";
  deleteBtn.addEventListener("click", () => {
    todos.splice(realIndex, 1);
    render();
    save();
  });

  li.append(checkbox, span, deleteBtn);
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
  todos.push({ text, done: false });
  input.value = "";
  render();
  save();
});

render();
