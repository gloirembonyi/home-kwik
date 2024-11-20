import React, { ReactNode } from 'react';

interface ModalHeaderProps {
  children: ReactNode;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ children }) => (
  <div className="border-b pb-2 mb-4">{children}</div>
);

export default ModalHeader;
