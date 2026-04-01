import type { Components } from 'react-markdown';
import { ScoringCards, type ScoringCandidate } from '../components/ChatPageComponents/ScoringCards';

export const markdownComponents: Components = {
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

  // eslint-disable-next-line
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const isJson = match && match[1] === 'json';
    const rawString = String(children);

    if (!inline && isJson) {
      try {
        const data = JSON.parse(rawString.replace(/\n$/, '')) as ScoringCandidate[];

        if (Array.isArray(data) && data.length > 0 && 'totalScore' in data[0]) {
          return <ScoringCards candidates={data} />;
        }
      } catch {
        if (rawString.trimStart().startsWith('[')) {
          return (
            <div className="py-2 px-3 bg-slate-50/80 text-slate-500 rounded-md text-[13px] font-medium my-3 border border-slate-100 w-max flex items-center">
              Generating cards
              <span className="ml-0.5 flex">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse" style={{ animationDelay: '200ms' }}>
                  .
                </span>
                <span className="animate-pulse" style={{ animationDelay: '400ms' }}>
                  .
                </span>
              </span>
            </div>
          );
        }

        return <code className="block bg-slate-100 p-2 text-xs overflow-x-auto">{rawString}</code>;
      }
    }

    return (
      <code
        className={`${className} bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] font-mono`}
        {...props}
      >
        {children}
      </code>
    );
  },
};
