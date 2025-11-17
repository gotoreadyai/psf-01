import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-2xl'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white ${maxWidth} w-11/12 max-h-[90vh] overflow-y-auto`}>
        <div className="border-b-2 border-black px-6 py-5 flex justify-between items-center">
          <h3 className="text-base font-bold uppercase tracking-wider">{title}</h3>
          <button
            onClick={onClose}
            className="text-2xl leading-none hover:opacity-70"
          >
            ×
          </button>
        </div>
        
        <div className="px-6 py-5">
          {children}
        </div>
        
        {footer && (
          <div className="border-t-2 border-black px-6 py-5 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
