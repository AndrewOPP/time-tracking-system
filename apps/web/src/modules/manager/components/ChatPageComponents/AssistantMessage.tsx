// AssistantMessage.tsx
import ReactMarkdown from 'react-markdown';
import { Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import { LoadingIndicator } from './LoadingIndicator';
import { messageStatusTypes } from '../../constants/constants';
import { ScoringCards, type ScoringCandidate } from './ScoringCards'; // <--- Импорт карточек

export function AssistantMessage({
  content,
  isReady,
  isTyping,
}: {
  content: string;
  isReady: boolean;
  isTyping: boolean;
}) {
  const [messageStatus, setMessageStatus] = useState(messageStatusTypes.NEUTRAL);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error('Error copying text: ', err);
    }
  };

  const blocks = useMemo(() => {
    return content.split(/\n\s*\n/);
  }, [content]);

  if (isTyping) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-3">
        AI Assistant
      </span>

      <div className="text-[15px] text-slate-800 leading-relaxed w-full">
        {blocks.map((block, index) => (
          <div
            key={index}
            className="fade-in-block w-full"
            style={{
              animationDelay: `${Math.min(index * 80, 400)}ms`,
              animationFillMode: 'both',
            }}
          >
            <ReactMarkdown
              components={{
                p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                strong: ({ ...props }) => (
                  <strong className="font-semibold text-slate-900" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-none pl-0 mb-6 space-y-3 text-slate-700" {...props} />
                ),
                li: ({ ...props }) => (
                  <li
                    className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-slate-400"
                    {...props}
                  />
                ),
                img: ({ ...props }) => (
                  <img
                    className="max-w-full max-h-10 object-contain rounded-md my-4 bg-slate-50"
                    alt={props.alt || 'Изображение'}
                    {...props}
                  />
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

                      // Если это какой-то другой сломанный JSON (не наш), рендерим как обычно
                      return (
                        <code className="block bg-slate-100 p-2 text-xs overflow-x-auto">
                          {rawString}
                        </code>
                      );
                    }
                  }

                  // Обычный инлайн-код
                  return (
                    <code
                      className={`${className} bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[13px] font-mono`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {block}
            </ReactMarkdown>
          </div>
        ))}
      </div>

      {isReady && (
        <div className="flex items-center gap-4 mt-3 pb-3 border-t border-transparent text-slate-400">
          <button
            className="cursor-pointer flex items-center gap-1.5 hover:text-slate-600 transition-colors"
            onClick={() =>
              setMessageStatus(prev =>
                prev === messageStatusTypes.LIKED
                  ? messageStatusTypes.NEUTRAL
                  : messageStatusTypes.LIKED
              )
            }
          >
            <ThumbsUp
              className={`w-5 h-5 ${
                messageStatus === messageStatusTypes.LIKED ? 'fill-[#3cfa91]' : ''
              }`}
            />
          </button>

          <button
            className="cursor-pointer flex items-center gap-1.5 hover:text-slate-600 transition-colors"
            onClick={() =>
              setMessageStatus(prev =>
                prev === messageStatusTypes.DISLIKED
                  ? messageStatusTypes.NEUTRAL
                  : messageStatusTypes.DISLIKED
              )
            }
          >
            <ThumbsDown
              className={`w-5 h-5 ${
                messageStatus === messageStatusTypes.DISLIKED ? 'fill-[#ff435c]' : ''
              }`}
            />
          </button>

          <button
            onClick={handleCopy}
            className={`cursor-pointer flex items-center gap-1.5 transition-colors text-[13px] font-medium ml-2 ${
              isCopied ? 'text-[#099749]' : 'hover:text-slate-600'
            }`}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
