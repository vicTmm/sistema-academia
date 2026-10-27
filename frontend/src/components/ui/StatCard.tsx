import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  colorScheme?: 'blue' | 'green' | 'teal' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  colorScheme = 'blue'
}) => {
  const iconBg = {
    blue: 'bg-acqua-50 text-acqua-600 border-acqua-100',
    green: 'bg-vital-50 text-vital-600 border-vital-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100'
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</span>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${iconBg[colorScheme]}`}>
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>
      <div>
        <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            {trend && (
              <span className={`font-semibold ${trendPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
