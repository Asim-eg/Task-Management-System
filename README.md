# Task Management System

A simple task management system implemented in Go using the Gin web framework and MongoDB as the database.

## Visit the Site - [Asim's Task Management System](https://asim-task-manage.vercel.app/)


## Overview

This project provides a basic backend for managing tasks. It includes functionality for retrieving all tasks, creating a new task, updating an existing task, deleting a task, and fetching a task by its ID. The application uses MongoDB as the underlying database to store task information.

## Getting Started

### Prerequisites

- Go installed on your machine
- MongoDB installed and running on localhost:27017

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Asim-eg/Task-Management-System.git
    cd TaskManage
    ```

2. **Run the application:**

    ```bash
    go run main.go
    ```

The server will start on port 8080, and you can access the API endpoints.

## API Endpoints

- **GET /tasks**: Retrieve all tasks.
- **GET /tasks/:id**: Retrieve a task by ID.
- **POST /tasks**: Create a new task.
- **PUT /tasks/:id**: Update a task by ID.
- **DELETE /tasks/:id**: Delete a task by ID.

## Usage

### Creating a Task

To create a new task, make a POST request to `/tasks` with the following JSON payload:

```json
{
  "name": "Task 2 Created and Updated",
  "description": "Task 1 Basically",
  "isCompleted": true,
  "createdAt": "2024-01-10T08:30:00Z",
  "updatedAt": "2024-01-10T10:45:00Z",
  "author": "Jane Smith",
  "comments": ["Another comment", "Yet another comment"],
  "shared": false
}
```

# Updating a Task
To update an existing task, make a PUT request to `/tasks/:id` with the updated task details in the JSON payload.

## Deleting a Task
To delete a task, make a DELETE request to `/tasks/:id`.

## Retrieving Tasks
- To retrieve all tasks, make a GET request to `/tasks`.
- To retrieve a task by ID, make a GET request to `/tasks/:id`.

## Contributing
If you'd like to contribute to this project, feel free to open an issue or submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE.md).

## Acknowledgements
- [Gin - HTTP web framework written in Go](https://github.com/gin-gonic/gin)
- [MongoDB Go Driver](https://github.com/mongodb/mongo-go-driver)
