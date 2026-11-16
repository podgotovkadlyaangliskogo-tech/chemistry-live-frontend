import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
