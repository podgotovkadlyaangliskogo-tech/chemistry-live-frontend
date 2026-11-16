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
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base font-semibold',
    xl: 'px-8 py-4 text-lg font-bold',
  };

  const variantClasses = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow focus:ring-blue-500 border border-blue-700/20',
    secondary:
      'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 focus:ring-stone-400',
    outline:
      'bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 focus:ring-blue-500 shadow-sm',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow focus:ring-red-500',
    ghost:
      'bg-transparent hover:bg-stone-100 text-stone-700 focus:ring-stone-300',
  };

  const disabledClasses =
    disabled || isLoading
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>Загрузка...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
