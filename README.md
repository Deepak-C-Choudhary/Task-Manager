# React Task Manager App

A full-stack task management application built with **React** for the frontend, **Node.js** and **Express** for the backend, and **MongoDB** for data storage. The app allows users to create, view, edit, delete, and mark tasks as completed.

---

## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Setup Instructions](#setup-instructions)
4. [Usage](#usage)
5. [Code Structure](#code-structure)
6. [Key Features & Decisions](#key-features--decisions)
7. [Error Handling](#error-handling)
8. [Future Enhancements](#future-enhancements)

---

## Features

### Task Management
- Create tasks with a title and description.
- View a list of all tasks.
- Mark tasks as completed (cannot re-mark already completed tasks).
- Edit task details (title and description).
- Delete tasks.

### Data Persistence
- Tasks are stored in a MongoDB database and retrieved dynamically.

### Validation
- Ensures task titles are not empty.
- Prevents marking tasks as completed multiple times.
- Graceful error handling with user-friendly error messages.

---

## Technology Stack

- **Frontend:** React (with npm for package management).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (MongoDB Compass for visualization).
- **Tools:**
  - `npm start` for running the frontend.
  - `npx nodemon` for running the backend.
  - `mongod` to start the MongoDB database.

---

## Setup Instructions

### Prerequisites
1. **Node.js**: Ensure you have Node.js installed on your system.
2. **MongoDB**: Install MongoDB and ensure the `mongod` service is running.
3. **npm**: Comes with Node.js for managing dependencies.

### Steps to Run the Application

#### Backend Setup
1. Clone the repository to your local machine:
   ```bash
   git clone <repository_url>
   cd <repository_name>
