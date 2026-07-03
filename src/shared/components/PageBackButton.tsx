import { ArrowLeft } from 'lucide-react';

interface PageBackButtonProps {
  onClick: () => void;
  label?: string;
}

export default function PageBackButton({ onClick, label = 'رجوع للخلف' }: PageBackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
      aria-label={label}
    >
      <ArrowLeft size={16} />
      <span>{label}</span>
    </button>
  );
}
