import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeDebugger = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
      <div className="text-xs">
        <p className="font-semibold mb-2">Theme Debug:</p>
        <p>Current Mode: <span className="font-mono">{isDark ? 'Dark' : 'Light'}</span></p>
        <p>HTML Class: <span className="font-mono">{document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</span></p>
        <p>localStorage: <span className="font-mono">{localStorage.getItem('theme')}</span></p>
        <button 
          onClick={toggleTheme}
          className="mt-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
};

export default ThemeDebugger;