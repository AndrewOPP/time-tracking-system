export interface UserTheme {
  banner: string;
  progress: string;
  // Семантические цвета для компонентов
  colorName: string;
  text: string; // Для активных табов и заголовков
  border: string; // Для подчеркивания табов
  bg: string; // Для легких фонов (логотипы, статусы)
  fill: string; // HEX-код специально для SVG (Радара)
}

export const VIBE_THEMES: UserTheme[] = [
  {
    colorName: 'indigo',
    banner: 'bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950',
    progress: 'bg-gradient-to-r from-indigo-400 via-purple-500 to-fuchsia-500',
    text: 'text-indigo-600',
    border: 'border-indigo-600',
    bg: 'bg-indigo-50',
    fill: '#6366f1',
  },
  {
    colorName: 'teal',
    banner: 'bg-gradient-to-r from-slate-950 via-teal-900 to-slate-950',
    progress: 'bg-gradient-to-r from-teal-400 via-emerald-500 to-green-500',
    text: 'text-teal-600',
    border: 'border-teal-600',
    bg: 'bg-teal-50',
    fill: '#14b8a6',
  },
  {
    colorName: 'rose',
    banner: 'bg-gradient-to-r from-gray-950 via-rose-950 to-gray-950',
    progress: 'bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500',
    text: 'text-rose-600',
    border: 'border-rose-600',
    bg: 'bg-rose-50',
    fill: '#f43f5e',
  },
  {
    colorName: 'fuchsia',
    banner: 'bg-gradient-to-r from-fuchsia-950 via-violet-900 to-fuchsia-950',
    progress: 'bg-gradient-to-r from-fuchsia-400 via-violet-500 to-indigo-500',
    text: 'text-fuchsia-600',
    border: 'border-fuchsia-600',
    bg: 'bg-fuchsia-50',
    fill: '#d946ef',
  },
  {
    colorName: 'emerald',
    banner: 'bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950',
    progress: 'bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500',
    text: 'text-emerald-600',
    border: 'border-emerald-600',
    bg: 'bg-emerald-50',
    fill: '#10b981',
  },
  {
    colorName: 'blue',
    banner: 'bg-gradient-to-r from-blue-950 via-cyan-900 to-blue-950',
    progress: 'bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500',
    text: 'text-blue-600',
    border: 'border-blue-600',
    bg: 'bg-blue-50',
    fill: '#3b82f6',
  },
  {
    colorName: 'orange',
    banner: 'bg-gradient-to-r from-stone-950 via-orange-950 to-stone-950',
    progress: 'bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500',
    text: 'text-orange-600',
    border: 'border-orange-600',
    bg: 'bg-orange-50',
    fill: '#f97316',
  },
];

export const getThemeForUser = (username: string): UserTheme => {
  if (!username) return VIBE_THEMES[0];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return VIBE_THEMES[Math.abs(hash) % VIBE_THEMES.length];
};
