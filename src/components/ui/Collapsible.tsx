import React, { useState } from 'react';

interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: number;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  defaultOpen = false,
  children,
  badge
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-[11px] uppercase tracking-wider font-medium text-gray-700 flex items-center gap-2">
          {title}
          {badge !== undefined && badge > 0 && (
            <span className="bg-black text-white text-[9px] px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </span>
        <span className="text-gray-500 text-sm">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      
      {isOpen && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
};
