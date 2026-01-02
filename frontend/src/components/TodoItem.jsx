import { todoAPI } from '../services/api';
import '../styles/TodoItem.css';

export default function TodoItem({ todo, onDelete, onUpdate }) {
  const handleToggle = async () => {
    try {
      await todoAPI.update(
        todo.id,
        todo.title,
        todo.description,
        !todo.completed
      );
      onUpdate(todo.id, !todo.completed);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await todoAPI.delete(todo.id);
      onDelete(todo.id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
      />
      <div className="todo-content">
        <h4>{todo.title}</h4>
        {todo.description && <p>{todo.description}</p>}
      </div>
      <button onClick={handleDelete} className="delete-btn">
        Delete
      </button>
    </div>
  );
}