import { getTasks, saveTasks } from "./storage.js";
import { validateTask } from "./validation.js";

// Generates a unique id. Uses crypto.randomUUID when available,
// otherwise falls back to a manual UUID-like string.
function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

// Creates a new task object with a unique id and default values,
// validates it, then saves it together with existing tasks.
// Throws an Error if validation fails or storage operations fail.
async function addTask(taskInput) {
  const newTask = {
    id: createId(),
    title: taskInput.title,
    description: taskInput.description || "",
    status: taskInput.status || "todo",
    priority: taskInput.priority || "medium",
    dueDate: taskInput.dueDate || null,
    tags: taskInput.tags || [],
  };

  const errors = validateTask(newTask);
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  const existingTasks = await getTasks();
  const updatedTasks = [...existingTasks, newTask];
  await saveTasks(updatedTasks);

  return newTask;
}

// Removes the task with the given id from storage.
// Throws an Error if no task with that id exists.
async function deleteTask(id) {
  const existingTasks = await getTasks();
  const taskExists = existingTasks.some((task) => task.id === id);

  if (!taskExists) {
    throw new Error(`Task with id ${id} not found`);
  }

  const updatedTasks = existingTasks.filter((task) => task.id !== id);
  await saveTasks(updatedTasks);
}

// Updates the task with the given id using the provided fields,
// validates the result, then saves it.
// Throws an Error if no task with that id exists or validation fails.
async function updateTask(id, updates) {
  const existingTasks = await getTasks();
  const taskIndex = existingTasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    throw new Error(`Task with id ${id} not found`);
  }

  const updatedTask = { ...existingTasks[taskIndex], ...updates, id };

  const errors = validateTask(updatedTask);
  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  const updatedTasks = [...existingTasks];
  updatedTasks[taskIndex] = updatedTask;

  await saveTasks(updatedTasks);

  return updatedTask;
}

// Returns tasks that match both the given status and search term.
// Pass "all" or omit status to skip status filtering.
// Pass an empty string or omit searchTerm to skip text search.
async function filterAndSearchTasks(status, searchTerm) {
  const tasks = await getTasks();

  let result = tasks;

  if (status && status !== "all") {
    result = result.filter(task => task.status === status);
  }

  if (searchTerm && searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    result = result.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term)
    );
  }

  return result;
}

export { addTask, deleteTask, updateTask, filterAndSearchTasks };