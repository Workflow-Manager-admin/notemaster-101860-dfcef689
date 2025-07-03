import React, { useState, useEffect } from 'react';
import './App.css';
import NotesLayout from './components/NotesLayout';

// PUBLIC_INTERFACE
function App() {
  /**
   * Wrapper for the application, theme management & main notes layout.
   */
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        style={{ position: "absolute", top: 20, right: 20, zIndex: 99 }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <NotesLayout />
    </div>
  );
}

export default App;
