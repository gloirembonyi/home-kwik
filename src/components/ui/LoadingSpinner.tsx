import React from 'react';

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent ${className}`} />
);