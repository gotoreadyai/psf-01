import React from 'react';
import { Link } from 'react-router-dom';

interface TopBarProps {
  title: string;
  linkTo: string;
  linkText: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title, linkTo, linkText }) => {
  return (
    <div className="border-b-3 border-black pb-5 mb-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tighter">{title}</h1>
      <Link
        to={linkTo}
        className="text-[13px] uppercase tracking-wider text-black hover:opacity-70 transition-opacity"
      >
        {linkText}
      </Link>
    </div>
  );
};
