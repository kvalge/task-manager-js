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
    tags: taskInput.tags || []
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
  const taskExists = existingTasks.some(task => task.id === id);

  if (!taskExists) {
    throw new Error(`Task with id ${id} not found`);
  }

  const updatedTasks = existingTasks.filter(task => task.id !== id);
  await saveTasks(updatedTasks);
}

export { addTask, deleteTask };