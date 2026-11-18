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
    md: 'p-6 sm:p-7',
    lg: 'p-8 sm:p-10',
  };

  return (
    <div
      className={`bg-[#10172A]/90 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.35)] ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
