document.addEventListener('DOMContentLoaded', function () {
  const taskListSection = document.getElementById('task-list');
  const taskForm = document.getElementById('task-form');

  // Fetch tasks on page load
  fetchTasks();

  // Event listener for form submission
  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const taskName = document.getElementById('task-name').value;
    const taskDescription = document.getElementById('task-description').value;

    // Create a new task object
    const newTask = {
      name: taskName,
      description: taskDescription,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'John Doe',
      comments: [],
      shared: false,
    };

    // Add the new task
    createTask(newTask);

    // Clear the form
    taskForm.reset();
  });

  // Function to fetch tasks from the server
  function fetchTasks() {
    fetch('/tasks')
      .then((response) => response.json())
      .then((data) => {
        // Update the UI with the retrieved tasks
        displayTasks(data.data);
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  }

  // Function to create a new task on the server
  function createTask(newTask) {
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the UI with the new task
        displayTask(data.data);
      })
      .catch((error) => console.error('Error creating task:', error));
  }

  // Function to display tasks on the page
  function displayTasks(tasks) {
    taskListSection.innerHTML = ''; // Clear the existing content

    tasks.forEach((task) => {
      displayTask(task);
    });
  }

  // Function to display a single task on the page
  function displayTask(task) {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
          <h3>${task.name}</h3>
          <p>${task.description}</p>
          <small>${task.createdAt}</small>
          <button onclick="updateTask('${task._id}')">Update Task</button>
          <button onclick="deleteTask('${task._id}')">Delete Task</button>
      `;
    taskListSection.appendChild(taskItem);
  }

  // Function to update a task on the server
  window.updateTask = function (taskId) {
    const updatedTask = {
      name: 'Updated Task Name',
      description: 'Updated Task Description',
      updatedAt: new Date().toISOString(),
    };

    fetch(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((data) => {
        // Fetch tasks again after updating
        fetchTasks();
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  // Function to delete a task on the server
  window.deleteTask = function (taskId) {
    fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        // Fetch tasks again after deleting
        fetchTasks();
      })
      .catch((error) => console.error('Error deleting task:', error));
  };
});
