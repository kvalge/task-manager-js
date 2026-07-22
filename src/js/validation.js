// Validates a task object and returns an array of error messages.
// An empty array means the task is valid.
function validateTask(task) {
  const errors = [];

  if (!task.title || task.title.trim() === "") {
    errors.push("Title is required");
  }

  if (task.dueDate && isNaN(Date.parse(task.dueDate))) {
    errors.push("Due date is invalid");
  }

  const validStatuses = ["todo", "in-progress", "done"];
  if (task.status && !validStatuses.includes(task.status)) {
    errors.push("Status must be one of: todo, in-progress, done");
  }

  const validPriorities = ["low", "medium", "high"];
  if (task.priority && !validPriorities.includes(task.priority)) {
    errors.push("Priority must be one of: low, medium, high");
  }

  return errors;
}

export { validateTask };