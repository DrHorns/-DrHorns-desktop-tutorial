const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMsg = document.getElementById("empty-msg");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateEmptyMsg() {
  emptyMsg.classList.toggle("hidden", todos.length > 0);
}

function renderTodo(todo, index) {
  const li = document.createElement("li");
  if (todo.done) li.classList.add("done");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.done;
  checkbox.addEventListener("change", () => {
    todos[index].done = checkbox.checked;
    li.classList.toggle("done", checkbox.checked);
    save();
  });

  const span = document.createElement("span");
  span.textContent = todo.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "\u00d7";
  deleteBtn.title = "Delete";
  deleteBtn.addEventListener("click", () => {
    todos.splice(index, 1);
    render();
    save();
  });

  li.append(checkbox, span, deleteBtn);
  return li;
}

function render() {
  list.innerHTML = "";
  todos.forEach((todo, i) => list.appendChild(renderTodo(todo, i)));
  updateEmptyMsg();
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
