import React, { useState, useEffect } from 'react';
import {
  useChatList,
  useChatMessages,
  useDeleteChat,
  useCreateChat,
} from '../hooks/useChatHistory';
import { ChatArea } from '../components/ChatPageComponents/ChatArea';

interface chat {
  id: string;
  title: string;
  updatedAt: string;
}

export function ManagerAIChatPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const { data: chats, isLoading: isChatsLoading } = useChatList();
  const { data: initialMessages = [], isFetching: isMessagesLoading } =
    useChatMessages(activeChatId);

  const createChatMutation = useCreateChat();

  const deleteChatMutation = useDeleteChat();

  useEffect(() => {
    if (isChatsLoading || !chats) return;
    const activeChatExists = chats.some((c: chat) => c.id === activeChatId);

    if (!activeChatId || !activeChatExists) {
      if (chats.length > 0) {
        setActiveChatId(chats[0].id);
      } else if (!createChatMutation.isPending) {
        createChatMutation.mutate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats, isChatsLoading, activeChatId]);

  const handleNewChat = () => {
    if (!createChatMutation.isPending) {
      createChatMutation.mutate();
    }
  };
  console.log(chats);

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();

    if (!chats) return;

    const currentIndex = chats.findIndex((c: chat) => c.id === chatId);
    const prevChatId = currentIndex - 1;

    deleteChatMutation.mutate(chatId);

    if (activeChatId === chatId) {
      setActiveChatId(chats[prevChatId]?.id || chats[currentIndex + 1]?.id || null);
    }
  };

  const isGlobalLoading = createChatMutation.isPending && !activeChatId;
  const showChatArea = activeChatId && !isMessagesLoading && !isGlobalLoading;

  return (
    <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden bg-white font-sans">
      <div className="w-72 border-r bg-slate-50 flex flex-col">
        <div className="p-4">
          <button
            onClick={handleNewChat}
            disabled={createChatMutation.isPending || isChatsLoading}
            className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
          >
            {createChatMutation.isPending ? 'Создаем...' : '+ New chat'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
          {chats?.map((chat: chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 rounded-lg cursor-pointer flex justify-between items-center group transition-colors ${
                activeChatId === chat.id
                  ? 'bg-slate-200 text-slate-900'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <span className="truncate text-sm font-medium pr-2">{chat.title || 'Новый чат'}</span>
              {chats.length > 1 && (
                <button
                  onClick={e => handleDeleteChat(e, chat.id)}
                  disabled={deleteChatMutation.isPending}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1 shrink-0 disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative flex flex-col items-center justify-center bg-white">
        {showChatArea && (
          <div className="absolute inset-0">
            <ChatArea key={activeChatId} chatId={activeChatId} initialMessages={initialMessages} />
          </div>
        )}
      </div>
    </div>
  );
}
