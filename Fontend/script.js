const taskManagerContainer = document.querySelector('.taskManager');
const confirmEl = document.querySelector('.confirm');
const confirmedBtn = confirmEl.querySelector('.confirmed');
const cancelledBtn = confirmEl.querySelector('.cancel');
let indexToBeDeleted = null;

const Tasks = [
  {
    id: String,
    name: String,
    description: String,
    isCompleted: Boolean,
    createdAt: Date,
    updatedAt: Date,
    author: String,
    comments: Array,
    shared: Boolean,
  },
];

let allTasks = [...Tasks];

const form = document.getElementById('taskForm');
const submitButton = document.getElementById('submit');

// Add event listener to the form submit event
form.addEventListener('submit', handleFormSubmit);

// Add event listener to the button click event
submitButton.addEventListener('click', handleFormSubmit);

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const authorNameInput = document.getElementById('authorName');
  //console.log(authorNameInput);
  const taskNameInput = document.getElementById('taskName');
  const taskDescriptionInput = document.getElementById('taskDescription');

  const authorName = authorNameInput.value.trim();
  const taskName = taskNameInput.value.trim();
  const taskDescription = taskDescriptionInput.value.trim();

  if (authorName !== '' && taskName !== '') {
    // Create a new task object
    const newTask = {
      name: taskName,
      description: taskDescription,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      author: authorName,
      comments: [],
      shared: false,
    };

    //console.log(newTask);

    try {
      // Make API call to create task
      await createTask(newTask);

      // Render tasks after creating a new task
      renderTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      // Handle error as needed
    }
  }
  // Clear input fields
  authorNameInput.value = '';
  taskNameInput.value = '';
  taskDescriptionInput.value = '';
}

// Function to handle button click (optional)
function handleButtonClick(event) {
  // You can add additional logic here if needed
  console.log('Button clicked!');
}

// Function to make API call and create a new task
async function createTask(task) {
  try {
    const response = await fetch('http://localhost:8080/tasks/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Error creating task');
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Initial rendering of tasks
renderTasks();

// Function to render tasks
async function renderTasks() {
  const taskContainer = document.getElementById('taskContainer');
  taskContainer.innerHTML = '';

  try {
    // Make API call to get tasks
    const response = await fetch('http://localhost:8080/tasks/get');
    if (!response.ok) {
      throw new Error('Error fetching tasks');
    }

    allTasks = await response.json();

    allTasks.data.forEach((allTasks, index) => {
      const taskCard = document.createElement('div');
      taskCard.classList.add('taskCard');
      let classVal = 'pending';
      let textVal = 'Pending';
      if (allTasks.isCompleted) {
        classVal = 'completed';
        textVal = 'Completed';
      }
      taskCard.classList.add(classVal);

      const taskText = document.createElement('p');
      taskText.innerText = allTasks.name;

      const taskStatus = document.createElement('p');
      taskStatus.classList.add('status');
      taskStatus.innerText = textVal;

      const toggleButton = document.createElement('button');
      toggleButton.classList.add('button-box');
      const btnContentEl = document.createElement('span');
      btnContentEl.classList.add('green');
      btnContentEl.innerText = allTasks.isCompleted
        ? 'Mark as Pending'
        : 'Mark as Completed';
      toggleButton.appendChild(btnContentEl);
      toggleButton.addEventListener('click', async () => {
        //allTasks.isCompleted = !allTasks.isCompleted;
        allTasks.updatedAt = new Date().toISOString();
        allTasks.isCompleted = !allTasks.isCompleted;
        await updateTask(allTasks);
        renderTasks();
      });

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('button-box');
      const delBtnContentEl = document.createElement('span');
      delBtnContentEl.classList.add('red');
      delBtnContentEl.innerText = 'Delete';
      deleteButton.appendChild(delBtnContentEl);
      deleteButton.addEventListener('click', () => {
        indexToBeDeleted = allTasks.id;
        confirmEl.style.display = 'block';
        taskManagerContainer.classList.add('overlay');
      });

      taskCard.appendChild(taskText);
      taskCard.appendChild(taskStatus);
      taskCard.appendChild(toggleButton);
      taskCard.appendChild(deleteButton);

      taskContainer.appendChild(taskCard);
    });
  } catch (error) {
    console.error(error.message);
  }
}

// Function to make API call and update task status
async function updateTask(task) {
  try {
    const response = await fetch(`http://localhost:8080/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Error updating task status');
    }
  } catch (error) {
    console.error(error.message);
  }
}

// Function to delete the selected task
async function deleteTask(index) {
  try {
    const response = await fetch(`http://localhost:8080/tasks/${index}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error deleting task');
    }

    renderTasks();
  } catch (error) {
    console.error(error.message);
  }
}

confirmedBtn.addEventListener('click', async () => {
  confirmEl.style.display = 'none';
  taskManagerContainer.classList.remove('overlay');
  await deleteTask(indexToBeDeleted);
});

cancelledBtn.addEventListener('click', () => {
  confirmEl.style.display = 'none';
  taskManagerContainer.classList.remove('overlay');
});
