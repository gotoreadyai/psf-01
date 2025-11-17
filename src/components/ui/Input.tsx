import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[10px] uppercase tracking-wide text-gray-600 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border border-black text-[13px] focus:outline-none focus:ring-2 focus:ring-black ${className}`}
        {...props}
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, className = '', children, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[10px] uppercase tracking-wide text-gray-600 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 border border-black text-[13px] focus:outline-none focus:ring-2 focus:ring-black ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
