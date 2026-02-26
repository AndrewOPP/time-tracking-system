import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  title: string;
  route: string;
}

export function BackButton({ title, route }: BackButtonProps) {
  const navigate = useNavigate();
  return (
    <div className="px-4 py-6 mb-2">
      <button
        onClick={() => navigate(route)}
        className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        {title}
      </button>
    </div>
  );
}
