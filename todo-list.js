let todoList = [];

function addTodoItem(task) {
  const todoItem = {
    task: task,
    done: false,
    id: Date.now()
  }

  todoList.push(todoItem);
  refreshTodoList(todoItem);
  saveLocalStorage();
}

function refreshTodoList(todoItem) {
  const oldItem = document.querySelector(`[data-id="${todoItem.id}"]`);

  if (todoItem.deleted) {
    oldItem.remove();
    return;
  }

  const ul = document.querySelector("#todo-list");
  const li = document.createElement("li");

  const isDone = todoItem.done ? "done" : "";
  li.setAttribute("class", `todo-item ${isDone}`)
  li.setAttribute("data-id", todoItem.id)
  li.innerHTML = `
  <input type="checkbox" id="${todoItem.id}"/>
  <label for="${todoItem.id}" class="tick"></label>
  <span>${todoItem.task}</span>
  <button class="delete">
    <img src="images/remove.png" />
  </button>
  `;

  if (oldItem) {
    ul.replaceChild(li, oldItem);
  } else {
    ul.insertBefore(li, ul.firstElementChild);
  }
}

function toggleDone(id) {
  const index = todoList.findIndex(todoItem => todoItem.id === Number(id));
  //console.log(`Array index: ${index}`);
  todoList[index].done = !todoList[index].done;
  refreshTodoList(todoList[index]);
  saveLocalStorage();
}

function deleteTodoItem(id) {
  const index = todoList.findIndex(todoItem => todoItem.id === Number(id));
  todoList[index].deleted = true;
  refreshTodoList(todoList[index]);
  todoList = todoList.filter(todoItem => todoItem.id !== Number(id));
  saveLocalStorage();
}

function saveLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todoList));
}

const form = document.querySelector("#todo-form");
// console.log(form);
//TODO: remove event parameter parenthese during recording
form.addEventListener("submit", (event) => {
  event.preventDefault();
  // console.log("submit event caught!");
  const input = document.querySelector("#todo-input");
  const task = input.value.trim();
  // console.log(task);

  if (task !== "") {
    addTodoItem(task);
    input.value = "";
  } else {
    alert("Please enter an item");
  }
});

const ul = document.querySelector("#todo-list");
ul.addEventListener("click", event => {
  const id = event.target.parentElement.dataset.id;
  // console.log("in event listener");
  console.log(event.target);
  if (event.target.classList.contains("tick")) {
    // console.log(`ID is ${id}`);
    toggleDone(id);
  } else if (event.target.classList.contains("delete")) {
    // console.log(`Delete ID = ${id}`);
    deleteTodoItem(id);
    console.log(todoList);
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const todoListString = localStorage.getItem('todo-list');
  console.log(todoListString);
  if (todoListString) {
    todoList = JSON.parse(todoListString);
    for(let i = 0; i < todoList.length; i++) {
      refreshTodoList(todoList[i]);
    }
  }
}); 
