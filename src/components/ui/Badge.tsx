interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'new';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-brand-50 text-brand-700 ring-brand-600/20',
  neutral: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  new: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
