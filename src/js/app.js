import { addTask } from "./taskService.js";

const taskForm = document.getElementById("task-form");

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
    const newTask = await addTask(taskInput);
    console.log("Task added successfully:", newTask);
    taskForm.reset();
  } catch (error) {
    console.error("Failed to add task:", error.message);
  }
});