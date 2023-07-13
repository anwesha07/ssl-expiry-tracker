import React, { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent scrolling of the background content when the modal is open
    document.body.style.overflow = 'hidden';
    document.body.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Restore scrolling when the modal is closed
      document.body.style.overflow = '';
      document.body.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div className="outline fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white rounded-lg p-6 mx-2 w-full max-w-[500px] flex flex-col gap-2"
        ref={modalRef}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
