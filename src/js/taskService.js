import { getTasks, saveTasks } from "./storage.js";
import { validateTask } from "./validation.js";

// Creates a new task object with a unique id and default values,
// validates it, then saves it together with existing tasks.
// Throws an Error if validation fails or storage operations fail.
async function addTask(taskInput) {
  const newTask = {
    id: crypto.randomUUID(),
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

// Returns tasks that match the given status.
// If status is "all" or not provided, returns all tasks unchanged.
async function filterTasks(status) {
  const tasks = await getTasks();

  if (!status || status === "all") {
    return tasks;
  }

  return tasks.filter((task) => task.status === status);
}

// Returns tasks whose title or description contains the given
// search term (case-insensitive). Returns all tasks if the
// search term is empty.
async function searchTasks(searchTerm) {
  const tasks = await getTasks();

  if (!searchTerm || searchTerm.trim() === "") {
    return tasks;
  }

  const term = searchTerm.toLowerCase();

  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term),
  );
}

export { addTask, deleteTask, updateTask, filterTasks, searchTasks };
