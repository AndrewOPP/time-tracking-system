import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { ChatSuggestions } from '../components/ChatPageComponents/ChatSuggestions';
import { AssistantMessage } from '../components/ChatPageComponents/AssistantMessage';
import { UserMessage } from '../components/ChatPageComponents/UserMessage';
import { ErrorMessage } from '../components/ChatPageComponents/ErrorMessage';
import { LoadingIndicator } from '../components/ChatPageComponents/LoadingIndicator';
import { ChatInput } from '../components/ChatPageComponents/ChatInput';

export function ManagerAIChatPage() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: import.meta.env.VITE_PUBLIC_API_URL + '/chat',
    }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const isReady = status === 'ready';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-white font-sans text-slate-900">
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          {messages.length === 0 ? (
            <ChatSuggestions onSelect={text => sendMessage({ text })} />
          ) : (
            <div className="flex flex-col gap-10">
              {messages.map((message: UIMessage) => {
                const textContent = message.parts
                  ?.filter(part => part.type === 'text')
                  .map(part => part.text)
                  .join('');

                const isTyping = message.role === 'assistant' && !textContent && isLoading;
                return (
                  <div key={message.id} className="flex flex-col w-full">
                    {message.role === 'user' ? (
                      <UserMessage content={textContent} />
                    ) : (
                      <AssistantMessage
                        content={textContent}
                        isReady={isReady}
                        isTyping={isTyping}
                      />
                    )}
                  </div>
                );
              })}

              {error && <ErrorMessage onRetry={() => regenerate()} />}

              {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1].role === 'user' && <LoadingIndicator />}

              <div ref={messagesEndRef} className="h-2" />
            </div>
          )}
        </div>
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmitForm}
        isDisabled={!isReady && !error}
      />
    </div>
  );
}
