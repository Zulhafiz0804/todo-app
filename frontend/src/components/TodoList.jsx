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
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter todos based on search query
  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate statistics
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = todos.filter(t => !t.completed).length;

  return (
    <div className="todo-app">
      {/* Header */}
      <div className="app-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="app-title">📝 Todo App</h1>
            <p className="app-subtitle">Stay organized and productive</p>
          </div>
          <div className="user-section">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-name">{username}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="todo-container">
        {/* Statistics */}
        <div className="statistics">
          <div className="stat-card total">
            <div className="stat-number">{todos.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="add-todo-form">
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Add more details... (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="form-textarea"
            />
          </div>
          <button type="submit" className="submit-btn">
            ✨ Add Task
          </button>
        </form>

        {/* Search Bar */}
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filter Buttons */}
        <div className="filter-section">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All <span className="badge">{todos.length}</span>
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          >
            Pending <span className="badge">{pendingCount}</span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed <span className="badge">{completedCount}</span>
          </button>
        </div>

        {/* Todos List */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">
              {searchQuery ? 'No tasks found' : 'No tasks yet'}
            </p>
            <p className="empty-subtitle">
              {searchQuery
                ? 'Try a different search'
                : 'Create your first task to get started!'}
            </p>
          </div>
        ) : (
          <div className="todos-grid">
            {filteredTodos.map((todo) => (
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
    </div>
  );
}