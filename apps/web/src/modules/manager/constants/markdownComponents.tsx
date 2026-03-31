import type { Components } from 'react-markdown';

export const markdownComponents: Components = {
  // --- Текст и списки ---
  p: ({ children }) => <p className="mb-4 last:mb-0 animate-fade-in-up">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  ul: ({ children }) => (
    <ul className="list-none pl-0 mb-6 space-y-3 text-slate-700 animate-fade-in-up">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 mb-6 space-y-3 text-slate-700 animate-fade-in-up">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-slate-400">
      {children}
    </li>
  ),

  // --- ЗАГОЛОВКИ ---
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-slate-900 mt-8 mb-4 animate-fade-in-up">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-slate-900 mt-7 mb-3 animate-fade-in-up">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-medium text-slate-900 mt-6 mb-3 animate-fade-in-up">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base font-medium text-slate-900 mt-5 mb-2 animate-fade-in-up">
      {children}
    </h4>
  ),

  // --- Медиа ---
  img: ({ src, alt, title }) => (
    <img
      src={src}
      alt={alt || 'Изображение'}
      title={title}
      className="max-w-full max-h-10 object-contain rounded-md my-4 bg-slate-50 animate-fade-in-up"
    />
  ),
};
