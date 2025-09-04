import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ children, variant, size = 'md' }: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`inline-flex items-center border rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
}