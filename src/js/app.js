import {
  addTask,
  deleteTask,
  updateTask,
  filterAndSearchTasks,
} from "./taskService.js";
import { getTasks } from "./storage.js";

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const submitButton = document.getElementById("submit-button");
const cancelEditButton = document.getElementById("cancel-edit-button");
const filterStatus = document.getElementById("filter-status");
const searchInput = document.getElementById("search-input");

// Holds the id of the task currently being edited, or null
// when the form is being used to add a new task.
let editingTaskId = null;

// Reads the current filter and search values from the UI,
// then renders the matching tasks.
async function refreshTaskList() {
  const tasks = await filterAndSearchTasks(
    filterStatus.value,
    searchInput.value,
  );
  renderTasks(tasks);
}

// Reads all tasks from storage and displays them as list items
// inside the task-list element.
async function renderTasks(tasks) {
  if (tasks === undefined) {
    tasks = await getTasks();
  }

  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.textContent = task.title;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      startEditing(task);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async function () {
      await deleteTask(task.id);
      refreshTaskList();
    });

    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
  });
}

// Fills the form with the given task's data and switches
// the form into "edit mode" for that task.
function startEditing(task) {
  editingTaskId = task.id;

  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("status").value = task.status;
  document.getElementById("priority").value = task.priority;
  document.getElementById("dueDate").value = task.dueDate || "";
  document.getElementById("tags").value = task.tags.join(", ");

  submitButton.textContent = "Update Task";
  cancelEditButton.style.display = "inline";
}

// Resets the form and switches it back to "add mode".
function cancelEditing() {
  editingTaskId = null;
  taskForm.reset();
  submitButton.textContent = "Add Task";
  cancelEditButton.style.display = "none";
}

cancelEditButton.addEventListener("click", cancelEditing);

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
    tags: tagsInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== ""),
  };

  try {
    if (editingTaskId === null) {
      await addTask(taskInput);
    } else {
      await updateTask(editingTaskId, taskInput);
      cancelEditing();
    }

    taskForm.reset();
    refreshTaskList();
  } catch (error) {
    console.error("Failed to save task:", error.message);
  }
});

filterStatus.addEventListener("change", refreshTaskList);

searchInput.addEventListener("input", refreshTaskList);

refreshTaskList();
