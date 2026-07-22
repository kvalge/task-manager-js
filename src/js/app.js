import { addTask } from "./taskService.js";
import { getTasks } from "./storage.js";

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// Reads all tasks from storage and displays them as list items
// inside the task-list element.
async function renderTasks() {
  const tasks = await getTasks();

  taskList.innerHTML = "";

  tasks.forEach(task => {
    const listItem = document.createElement("li");
    listItem.textContent = task.title;
    taskList.appendChild(listItem);
  });
}

taskForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const statusInput = document.getElementById("status");
  const priorityInput = document.getElementById("priority");
  const dueDateInput = document.getElementById("dueDate");
  const tagsInput = document.getElementById("tags");

  const taskInput = {
    title: titleInput.value,
    description: descriptionInput.value,
    status: statusInput.value,
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
    tags: tagsInput.value.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
  };

  try {
    await addTask(taskInput);
    taskForm.reset();
    renderTasks();
  } catch (error) {
    console.error("Failed to add task:", error.message);
  }
});

renderTasks();