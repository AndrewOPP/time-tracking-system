import React, { useState, useRef, useEffect, memo, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { ChatSuggestions } from '../components/ChatPageComponents/ChatSuggestions';
import { ErrorMessage } from '../components/ChatPageComponents/ErrorMessage';
import { LoadingIndicator } from '../components/ChatPageComponents/LoadingIndicator';
import { ChatInput } from '../components/ChatPageComponents/ChatInput';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useChatStore } from '../types/stores/useChatStore';
import { ChatMessage } from '../components/ChatPageComponents/ChatMessage';
import { tokenRefresh } from '@/modules/auth/api/auth.api';

const MemoChatMessage = memo(ChatMessage);

export function ManagerAIChatPage() {
  const { savedMessages, setSavedMessages } = useChatStore();
  const [input, setInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const chatTransport = useMemo(() => {
    return new DefaultChatTransport({
      api: import.meta.env.VITE_PUBLIC_API_URL + '/chat',
      fetch: async (input, init) => {
        const token = useAuthStore.getState().accessToken;

        const makeRequest = (t: string) =>
          fetch(input, {
            ...init,
            headers: {
              ...init?.headers,
              Authorization: `Bearer ${t}`,
            },
          });

        let response = await makeRequest(token ?? '');

        if (response.status === 401) {
          const { data, error: refreshError } = await tokenRefresh();

          if (!refreshError && data) {
            useAuthStore.getState().setAuth(data.user, data.accessToken);

            response = await makeRequest(data.accessToken);
          } else {
            useAuthStore.getState().clearAuth();
          }
        }

        return response;
      },
    });
  }, []);

  const { messages, sendMessage, status, error, regenerate } = useChat({
    messages: savedMessages ?? [],
    transport: chatTransport,
    experimental_throttle: 50,
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const isReady = status === 'ready';

  useEffect(() => {
    if (status === 'ready' && messages.length > 0) {
      setSavedMessages(messages);
    }
  }, [status, setSavedMessages, messages]);

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput('');

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 100);
  };

  const lastMessageIndex = messages.length - 1;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-white font-sans text-slate-900 custom-scrollbar">
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4 flex flex-col">
        <div
          className={`w-full max-w-3xl mx-auto flex flex-col ${
            messages.length === 0 ? 'flex-1 justify-center' : ''
          }`}
        >
          {messages.length === 0 ? (
            <ChatSuggestions onSelect={text => sendMessage({ text })} />
          ) : (
            <>
              <div className="flex flex-col gap-8">
                {messages.map((message: UIMessage, index: number) => {
                  const isMessageReady = status === 'ready' || index !== messages.length - 1;

                  const isLastAssistant =
                    message.role !== 'user' &&
                    index === messages.length - 1 &&
                    messages.length >= 2;

                  return (
                    <div
                      style={{ contentVisibility: 'auto' }}
                      key={message.id}
                      className={`${isLastAssistant ? 'min-h-[58vh]' : ''}`}
                    >
                      <MemoChatMessage
                        message={message}
                        isReady={isMessageReady}
                        isLoading={isLoading}
                      />
                    </div>
                  );
                })}

                {error && <ErrorMessage onRetry={() => regenerate()} />}

                {isLoading && messages.length > 0 && messages[lastMessageIndex].role === 'user' && (
                  <div className="min-h-[58vh]">
                    <LoadingIndicator />
                  </div>
                )}
              </div>

              <div ref={messagesEndRef} />
            </>
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
