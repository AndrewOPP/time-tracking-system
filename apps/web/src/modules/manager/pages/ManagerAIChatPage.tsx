import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { ChatSuggestions } from '../components/ChatPageComponents/ChatSuggestions';
import { ErrorMessage } from '../components/ChatPageComponents/ErrorMessage';
import { LoadingIndicator } from '../components/ChatPageComponents/LoadingIndicator';
import { ChatInput } from '../components/ChatPageComponents/ChatInput';

import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useChatStore } from '../types/stores/useChatStore';
import { ChatMessage } from '../components/ChatPageComponents/ChatMessage';

export function ManagerAIChatPage() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const accessToken = useAuthStore(state => state.accessToken);
  const { savedMessages, setSavedMessages } = useChatStore();
  const [input, setInput] = useState('');

  const isInitialRender = useRef(true);
  const shouldAutoScrollRef = useRef(true);

  const { messages, sendMessage, status, error, regenerate } = useChat({
    messages: savedMessages ?? [],
    transport: new DefaultChatTransport({
      api: import.meta.env.VITE_PUBLIC_API_URL + '/chat',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  });
  console.log(error, 'error');

  const isLoading = status === 'submitted' || status === 'streaming';
  const isReady = status === 'ready';

  useEffect(() => {
    if (status === 'ready' && messages.length > 0) {
      setSavedMessages(messages);
    }
  }, [status, messages, setSavedMessages]);

  const isUserAtBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    const threshold = 80;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  const handleScroll = () => {
    shouldAutoScrollRef.current = isUserAtBottom();
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (!shouldAutoScrollRef.current) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'auto',
    });

    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [messages]);

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput('');

    requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-white font-sans text-slate-900">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto px-4 pt-8 pb-4 ${
          isLoading ? 'pointer-events-none select-none' : ''
        }`}
      >
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          {messages.length === 0 ? (
            <ChatSuggestions onSelect={text => sendMessage({ text })} />
          ) : (
            <div className="flex flex-col gap-10">
              {messages.map((message: UIMessage) => {
                return <ChatMessage message={message} isReady={isReady} isLoading={isLoading} />;
              })}

              {error && <ErrorMessage onRetry={() => regenerate()} />}

              {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1].role === 'user' && <LoadingIndicator />}
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
