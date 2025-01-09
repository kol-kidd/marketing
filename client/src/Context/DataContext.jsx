import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a Context
const DataContext = createContext();

// Context Provider component
export function DataProvider({ children }) {
  // Initialize state with localStorage for darkMode
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [metricData, setMetricData] = useState({});
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Sync darkMode state with localStorage and the <html> class
  useEffect(() => {
    if (darkMode) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const value = {
    lineChartData,
    barChartData,
    metricData,
    setLineChartData,
    setBarChartData,
    setMetricData,
    darkMode,
    setDarkMode,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Custom hook to use context
export function useDataContext() {
  return useContext(DataContext);
}
