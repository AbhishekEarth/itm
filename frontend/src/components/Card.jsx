import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}
