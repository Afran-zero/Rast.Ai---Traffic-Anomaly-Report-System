import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'teal' | 'orange' | 'red' | 'blue' | 'green' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  const colorClasses = {
    teal: 'bg-teal-500 text-teal-500 bg-teal-50 border-teal-200',
    orange: 'bg-orange-500 text-orange-500 bg-orange-50 border-orange-200',
    red: 'bg-red-500 text-red-500 bg-red-50 border-red-200',
    blue: 'bg-blue-500 text-blue-500 bg-blue-50 border-blue-200',
    green: 'bg-green-500 text-green-500 bg-green-50 border-green-200',
    purple: 'bg-purple-500 text-purple-500 bg-purple-50 border-purple-200',
  };

  const [bgColor, textColor, cardBg, borderColor] = colorClasses[color].split(' ');

  return (
    <div className={`${cardBg} ${borderColor} border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}