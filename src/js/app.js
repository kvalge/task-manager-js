import { addTask } from "./taskService.js";

// Get a reference to the form element from the DOM
const taskForm = document.getElementById("task-form");

// Listen for the form's submit event
taskForm.addEventListener("submit", function (event) {
  // Prevent the browser's default behavior of reloading the page
  event.preventDefault();

  console.log("Form submitted");
});