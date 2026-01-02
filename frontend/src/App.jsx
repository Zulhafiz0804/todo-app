import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import './App.css';

export default function App() {
  const [authState, setAuthState] = useState('check');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setAuthState('authenticated');
    } else {
      setAuthState('login');
    }
  }, []);

  if (authState === 'authenticated') {
    return <TodoList />;
  }

  return (
    <div className="app">
      {authState === 'login' && (
        <>
          <Login onLoginSuccess={() => setAuthState('authenticated')} />
          <p className="auth-toggle">
            Don't have an account?{' '}
            <button onClick={() => setAuthState('register')}>
              Register here
            </button>
          </p>
        </>
      )}
      {authState === 'register' && (
        <>
          <Register onRegisterSuccess={() => setAuthState('login')} />
          <p className="auth-toggle">
            Already have an account?{' '}
            <button onClick={() => setAuthState('login')}>
              Login here
            </button>
          </p>
        </>
      )}
    </div>
  );
}