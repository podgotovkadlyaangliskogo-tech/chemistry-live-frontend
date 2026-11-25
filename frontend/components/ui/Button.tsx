import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-sans font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] active:scale-[0.97] select-none cursor-pointer';

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-sm',
    xl: 'px-7 py-3.5 text-base',
  };

  const variants = {
    primary:
      'bg-[#E8C547] hover:bg-[#f0d060] text-[#09090B] shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_4px_16px_rgba(232,197,71,0.25)] focus-visible:ring-[#E8C547]',
    secondary:
      'bg-white/[0.06] hover:bg-white/[0.1] text-[#F5F4F0] border border-white/10 hover:border-white/20 focus-visible:ring-white/30',
    outline:
      'bg-transparent hover:bg-white/[0.04] text-[#E8C547] border border-[#E8C547]/40 hover:border-[#E8C547]/70 focus-visible:ring-[#E8C547]',
    danger:
      'bg-[#E03A3E] hover:bg-[#c42030] text-white shadow-[0_4px_16px_rgba(224,58,62,0.3)] focus-visible:ring-red-500',
    ghost:
      'bg-transparent hover:bg-white/[0.06] text-[#71717A] hover:text-[#F5F4F0] focus-visible:ring-white/30',
  };

  const disabledStyles =
    disabled || isLoading ? 'opacity-40 cursor-not-allowed pointer-events-none' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabledStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
          <span>Подождите...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
