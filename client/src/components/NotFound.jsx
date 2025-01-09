// src/components/NotFound.jsx
import React from "react";

const NotFound = () => {
  return (
    <div className="not-found h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg">Oops! The page you're looking for doesn't exist.</p>
      <a href="/dashboard" className="mt-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go to Dashboard
      </a>
    </div>
  );
};

export default NotFound;