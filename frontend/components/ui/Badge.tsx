import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'stone';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  className = '',
}) => {
  const variantClasses = {
    blue: 'bg-[#4F8EF7]/15 text-[#4F8EF7] border-[#4F8EF7]/30',
    green: 'bg-[#39D98A]/15 text-[#39D98A] border-[#39D98A]/30',
    yellow: 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/30',
    red: 'bg-[#FF4757]/15 text-[#FF4757] border-[#FF4757]/30',
    stone: 'bg-white/[0.06] text-slate-300 border-white/10',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
