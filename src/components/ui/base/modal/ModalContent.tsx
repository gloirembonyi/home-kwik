import React, { ReactNode } from 'react';

interface ModalContentProps {
  children: ReactNode;
}

const ModalContent: React.FC<ModalContentProps> = ({ children }) => (
  <div className="space-y-4">{children}</div>
);

export default ModalContent;
