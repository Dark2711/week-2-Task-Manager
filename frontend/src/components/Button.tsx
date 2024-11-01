import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  className = '',
  isLoading = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full 
        bg-black 
        text-white 
        rounded-lg 
        p-2 
        text-lg 
        hover:bg-gray-800 
        transition 
        duration-300 
        ${disabled || isLoading ? 'cursor-not-allowed opacity-50' : ''}
        ${className}
        flex 
        items-center 
        justify-center
      `}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? 'Loading...' : label}
    </button>
  );
};

export default Button;
