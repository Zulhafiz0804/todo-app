import { useState, useEffect } from 'react';
import { todoAPI } from '../services/api';
import TodoItem from './TodoItem';
import '../styles/TodoList.css';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    loadTodos();
  }, [filter]);

  const loadTodos = async () => {
    setLoading(true);
    try {
      let response;
      if (filter === 'completed') {
        response = await todoAPI.getCompleted(userId);
      } else if (filter === 'pending') {
        response = await todoAPI.getPending(userId);
      } else {
        response = await todoAPI.getUserTodos(userId);
      }
      setTodos(response.data);
    } catch (err) {
      console.error('Failed to load todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await todoAPI.create(parseInt(userId), title, description);
      setTodos([...todos, response.data]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create todo:', err);
    }
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleUpdateTodo = (id, completed) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed } : t
    ));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="todo-container">
      <div className="header">
        <h1>Todo App</h1>
        <p>Welcome, {username}!</p>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
        />
        <button type="submit">Add Todo</button>
      </form>

      <div className="filter-buttons">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          All ({todos.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={filter === 'pending' ? 'active' : ''}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <p>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p className="empty-message">No todos yet. Create one to get started!</p>
      ) : (
        <div className="todos-list">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
}