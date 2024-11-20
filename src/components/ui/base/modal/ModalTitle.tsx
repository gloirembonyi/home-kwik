import React, { ReactNode } from 'react';

interface ModalTitleProps {
  children: ReactNode;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ children }) => (
  <h3 className="text-xl font-semibold">{children}</h3>
);

export default ModalTitle;
