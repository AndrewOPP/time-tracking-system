import ReactMarkdown from 'react-markdown';
import { Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { useState, memo } from 'react';
import { LoadingIndicator } from './LoadingIndicator';
import { messageStatusTypes } from '../../constants/constants';
import { markdownComponents } from '../../constants/markdownComponents';

export const AssistantMessage = memo(
  ({ content, isReady, isTyping }: { content: string; isReady: boolean; isTyping: boolean }) => {
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

    if (isTyping) {
      return <LoadingIndicator />;
    }

    return (
      <div className="flex flex-col w-full max-w-full">
        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-3 select-none">
          AI Assistant
        </span>

        <div className="text-[15px] text-slate-800 leading-relaxed">
          {/* 2. Максимальная производительность: ОДИН парсер на весь текст */}
          <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
        </div>

        {/* 3. Кнопки действий появляются только когда ответ готов */}
        {isReady && (
          <div className="flex items-center gap-4 mt-3 pb-3 border-t border-transparent text-slate-400 animate-fade-in-up">
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
                className={`w-5 h-5 transition-colors ${
                  messageStatus === messageStatusTypes.LIKED ? 'fill-[#3cfa91] text-[#3cfa91]' : ''
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
                className={`w-5 h-5 transition-colors ${
                  messageStatus === messageStatusTypes.DISLIKED
                    ? 'fill-[#ff435c] text-[#ff435c]'
                    : ''
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
                  <Check className="w-4 h-4 animate-in zoom-in duration-200" />
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
);

AssistantMessage.displayName = 'AssistantMessage';
