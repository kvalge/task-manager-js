const STORAGE_KEY = "tasks";

// Reads the list of tasks from localStorage.
// Returns an empty array if no tasks have been saved yet.
async function getTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    throw new Error(`Failed to read tasks from storage: ${error.message}`);
  }
}

// Saves the given list of tasks to localStorage, overwriting
// whatever was stored before.
async function saveTasks(tasks) {
  try {
    const data = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, data);
    return true;
  } catch (error) {
    throw new Error(`Failed to save tasks to storage: ${error.message}`);
  }
}

export { getTasks, saveTasks };