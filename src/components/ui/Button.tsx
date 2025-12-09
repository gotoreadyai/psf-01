import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'uppercase tracking-wider font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-6 py-3 text-[11px]'
  };
  
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800',
    outline: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
