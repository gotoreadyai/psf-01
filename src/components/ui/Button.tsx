import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'px-6 py-3 text-[11px] uppercase tracking-wider font-medium cursor-pointer transition-colors';
  
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800',
    outline: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
