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

export { addTask };