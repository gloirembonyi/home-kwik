import React from 'react';

interface ModalCloseButtonProps {
  onClick: () => void;
}

const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({ onClick }) => (
  <button className="absolute top-2 right-2 text-gray-500" onClick={onClick}>
    <span className="text-lg">×</span>
  </button>
);

export default ModalCloseButton;
