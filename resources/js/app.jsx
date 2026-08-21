import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import '../css/app.css';

function App() {
  // State for logged in user (null if on login page)
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
