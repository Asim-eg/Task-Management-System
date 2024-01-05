let tasks = [];
let indexToBeDeleted = -1;
let taskManagerContainer;

// Retrieve tasks from the server
async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:8080/tasks/');
    const data = await response.json();
    tasks = data.data;
    renderTasks();
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

// Create a new task on the server
async function createTask(task) {
  try {
    const response = await fetch('http://localhost:8080/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    const data = await response.json();

    if (data.data) {
      // Ensure that data.data is not null before pushing
      tasks.push(data.data);
      renderTasks();
    } else {
      console.error('Error creating task:', data.message);
    }
  } catch (error) {
    console.error('Error creating task:', error);
  }
}

// Update an existing task on the server
async function updateTask(taskId, updateData) {
  try {
    const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    await response.json();
    renderTasks();
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

// Delete a task on the server
async function deleteTask(taskId) {
  try {
    const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: 'DELETE',
    });
    await response.json();
    renderTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

// Modify the handleFormSubmit function to remove the ID assignment
async function handleFormSubmit() {
  const taskNameInput = document.getElementById('taskName');
  const taskDescriptionInput = document.getElementById('taskDescription');

  const taskName = taskNameInput.value.trim();
  const taskDescription = taskDescriptionInput.value.trim();

  if (taskName !== '') {
    const newTask = {
      name: taskName,
      description: taskDescription,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: '',
      comments: [],
      shared: false,
    };

    await createTask(newTask);
    taskNameInput.value = ''; // Clear the task name input field
    taskDescriptionInput.value = ''; // Clear the task description input field
  }
}

// Function to render tasks
function renderTasks() {
  taskManagerContainer = document.getElementById('taskManagerContainer'); // Add this line
  taskManagerContainer.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('taskCard');
    let classVal = 'pending';
    let textVal = 'Pending';
    if (task.isCompleted) {
      classVal = 'completed';
      textVal = 'Completed';
    }
    taskCard.classList.add(classVal);

    const taskText = document.createElement('p');
    taskText.innerText = task.name;

    const taskStatus = document.createElement('p');
    taskStatus.classList.add('status');
    taskStatus.innerText = textVal;

    const toggleButton = document.createElement('button');
    toggleButton.classList.add(
      'button-box',
      classVal === 'completed' ? 'green' : 'red',
    );
    const btnContentEl = document.createElement('span');
    btnContentEl.innerText = task.isCompleted
      ? 'Mark as Pending'
      : 'Mark as Completed';
    toggleButton.appendChild(btnContentEl);
    toggleButton.addEventListener('click', async () => {
      tasks[index].isCompleted = !tasks[index].isCompleted;
      await updateTask(tasks[index].id, {
        isCompleted: tasks[index].isCompleted,
      });
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('button-box', 'red');
    const delBtnContentEl = document.createElement('span');
    delBtnContentEl.innerText = 'Delete';
    deleteButton.appendChild(delBtnContentEl);
    deleteButton.addEventListener('click', () => {
      indexToBeDeleted = index;
      confirmEl.style.display = 'block';
      taskManagerContainer.classList.add('overlay');
    });

    taskCard.appendChild(taskText);
    taskCard.appendChild(taskStatus);
    taskCard.appendChild(toggleButton);
    taskCard.appendChild(deleteButton);

    taskContainer.appendChild(taskCard);
  });
}

// Update the confirmedBtn event listener to use the deleteTask function
function confirmDelete() {
  confirmEl.style.display = 'none';
  taskManagerContainer.classList.remove('overlay');
  if (indexToBeDeleted !== -1) {
    deleteTask(tasks[indexToBeDeleted].id);
  }
  indexToBeDeleted = -1; // Reset the index after deletion
}

// Cancel the delete operation
function cancelDelete() {
  confirmEl.style.display = 'none';
  taskManagerContainer.classList.remove('overlay');
  indexToBeDeleted = -1; // Reset the index if cancellation
}

// Initial fetching and rendering of tasks
fetchTasks();
