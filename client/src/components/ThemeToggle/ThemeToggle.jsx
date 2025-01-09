import React, { useState, useEffect } from 'react';
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useDataContext } from '../../Context/DataContext';

const ThemeToggle = () => {

  const { darkMode, setDarkMode } =  useDataContext(); 

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded bg-gray-200 dark:bg-gray-800 dark:text-white"
    >
    {darkMode ? <MdLightMode/> : <MdDarkMode/>} 
    </button>
  );
};

export default ThemeToggle;
