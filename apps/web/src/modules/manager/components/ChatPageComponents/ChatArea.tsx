import React, { useState, useRef, memo, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { ChatSuggestions } from './ChatSuggestions';
import { ErrorMessage } from './ErrorMessage';
import { LoadingIndicator } from './LoadingIndicator';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { AI_CHAT_PAGE_CONFIG } from '../../constants/constants';
import { tokenRefresh } from '@/modules/auth/api/auth.api';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { ROUTES } from '@/shared/constants/routes';
import { useInvalidateChatList, useChatMessages } from '../../hooks/useChatHistory';

const MemoChatMessage = memo(ChatMessage);

function ChatAreaInner({
  chatId,
  initialMessages,
}: {
  chatId: string;
  initialMessages: UIMessage[];
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const invalidateChatList = useInvalidateChatList();

  const chatTransport = useMemo(() => {
    return new DefaultChatTransport({
      api: import.meta.env.VITE_PUBLIC_API_URL + ROUTES.MANAGER.AI_CHAT_TRANSPORT,
      fetch: async (url, init) => {
        const token = useAuthStore.getState().accessToken;

        let modifiedBody = init?.body;
        if (init?.body && typeof init.body === 'string') {
          try {
            const parsedBody = JSON.parse(init.body);
            modifiedBody = JSON.stringify({ ...parsedBody, chatId });
          } catch (e) {
            console.error('Failed to parse chat request body', e);
          }
        }

        const makeRequest = (t: string) =>
          fetch(url, {
            ...init,
            body: modifiedBody,
            headers: { ...init?.headers, Authorization: `Bearer ${t}` },
          });

        let response = await makeRequest(token ?? '');

        if (response.status === 401) {
          const { data, error } = await tokenRefresh();
          if (!error && data) {
            useAuthStore.getState().setAuth(data.user, data.accessToken);
            response = await makeRequest(data.accessToken);
          } else {
            useAuthStore.getState().clearAuth();
          }
        }

        return response;
      },
    });
  }, [chatId]);

  const { messages, sendMessage, status, error, regenerate } = useChat({
    id: chatId,
    messages: initialMessages,
    transport: chatTransport,
    experimental_throttle: AI_CHAT_PAGE_CONFIG.experimental_throttle,

    onFinish: () => {
      invalidateChatList();
    },
  });
  console.dir(error, 'error');

  const isLoading = status === 'submitted' || status === 'streaming';
  const isReady = status === 'ready';

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput('');

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleSuggestionSelect = (text: string) => {
    sendMessage({ text });
  };

  const lastMessageIndex = messages.length - 1;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white font-sans text-slate-900 custom-scrollbar relative">
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4 flex flex-col">
        <div
          className={`w-full max-w-3xl mx-auto flex flex-col ${messages.length === 0 ? 'flex-1 justify-center' : ''}`}
        >
          {messages.length === 0 ? (
            <ChatSuggestions onSelect={handleSuggestionSelect} />
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

                {error && (
                  <ErrorMessage
                    text={(() => {
                      if (!error.message) return 'An unexpected error occurred.';
                      try {
                        const parsedError = JSON.parse(error.message);
                        return parsedError.message || error.message;
                      } catch {
                        return error.message;
                      }
                    })()}
                    onRetry={() => {
                      regenerate();
                    }}
                  />
                )}

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

export function ChatArea({ chatId }: { chatId: string }) {
  const { data: initialMessages, isLoading } = useChatMessages(chatId);

  if (isLoading && !initialMessages) {
    return null;
  }

  return <ChatAreaInner chatId={chatId} initialMessages={initialMessages || []} />;
}
