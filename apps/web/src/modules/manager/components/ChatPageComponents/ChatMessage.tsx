import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import { memo, useMemo } from 'react';
import type { UIMessage } from 'ai';

interface ChatMessageProps {
  message: UIMessage;
  isReady: boolean;
  isLoading: boolean;
}

export const ChatMessage = memo(({ message, isReady, isLoading }: ChatMessageProps) => {
  const textContent = useMemo(
    () =>
      message.parts
        ?.filter(part => part.type === 'text')
        .map(part => part.text)
        .join(''),
    [message.parts]
  );

  const isTyping = message.role === 'assistant' && !textContent && isLoading;

  return (
    <div className="flex flex-col w-full">
      {message.role === 'user' ? (
        <UserMessage content={textContent || ''} />
      ) : (
        <AssistantMessage content={textContent || ''} isReady={isReady} isTyping={isTyping} />
      )}
    </div>
  );
});
