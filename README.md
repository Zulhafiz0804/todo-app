# 📝 Todo App

A full-stack web application for managing daily tasks with user authentication, search, and filtering.

## Features

- User registration & login
- Create, read, update, delete todos
- Search and filter todos by status
- Statistics dashboard (total, pending, completed)
- Modern, responsive UI with animations
- PostgreSQL database

## Tech Stack

**Backend:** Java 17, Spring Boot, PostgreSQL, Maven
**Frontend:** React, Vite, Axios, CSS3

## Project Structure
```
todo-app/
├── backend/   - Java Spring Boot API
├── frontend/  - React application
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/todos` - Create todo
- `GET /api/todos/user/{userId}` - Get todos
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo

## How to Run

**Backend:**
```bash
cd backend
mvn clean install
java -jar target/todo-app-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
