import { ShieldCheck, AlertCircle, AlertOctagon } from 'lucide-react';

export const getScoreColor = (score: number) => {
  if (score < 0) return 'text-rose-600';
  if (score >= 80) return 'text-emerald-500';
  if (score >= 50) return 'text-amber-500';
  return 'text-rose-500';
};

export const getBarColor = (score: number) => {
  if (score < 0) return 'bg-rose-600';
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};

export const getRisk = (score: number) => {
  if (score >= 80)
    return { label: 'Low', color: 'bg-emerald-100 text-emerald-700', icon: ShieldCheck };
  if (score >= 50)
    return { label: 'Medium', color: 'bg-amber-100 text-amber-700', icon: AlertCircle };
  return { label: 'High', color: 'bg-rose-100 text-rose-700', icon: AlertOctagon };
};
