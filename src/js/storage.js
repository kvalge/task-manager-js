const STORAGE_KEY = "tasks";

function getTasks() {
  return new Promise((resolve, reject) => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const tasks = data ? JSON.parse(data) : [];
      resolve(tasks);
    } catch (error) {
      reject(new Error(`Failed to read tasks from storage: ${error.message}`));
    }
  });
}

function saveTasks(tasks) {
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.stringify(tasks);
      localStorage.setItem(STORAGE_KEY, data);
      resolve(true);
    } catch (error) {
      reject(new Error(`Failed to save tasks to storage: ${error.message}`));
    }
  });
}

export { getTasks, saveTasks };


// AJUTINE TEST - eemaldame hiljem
saveTasks([{ id: 1, title: "Test task" }])
  .then(() => console.log("Saved successfully"))
  .catch(error => console.error(error.message));

getTasks()
  .then(tasks => console.log("Loaded tasks:", tasks))
  .catch(error => console.error(error.message));