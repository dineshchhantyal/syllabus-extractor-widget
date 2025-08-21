import React from 'react';

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-white dark:bg-neutral-900 shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}
