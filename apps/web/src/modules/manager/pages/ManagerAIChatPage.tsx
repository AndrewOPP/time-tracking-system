import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatId = searchParams.get('chatId');

  const setActiveChatId = (id: string | null) => {
    setSearchParams(
      prev => {
        if (id) {
          prev.set('chatId', id);
        } else {
          prev.delete('chatId');
        }
        return prev;
      },
      { replace: true }
    );
  };

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
  }, [chats, isChatsLoading, activeChatId]);

  const handleNewChat = () => {
    if (!createChatMutation.isPending) {
      createChatMutation.mutate();
    }
  };

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
      <div className="w-[240px] shrink-0 border-r border-slate-200 bg-transparent flex flex-col">
        <div className="p-4 pl-0 pb-3 pr-7">
          <button
            onClick={handleNewChat}
            disabled={createChatMutation.isPending || isChatsLoading}
            className="w-full py-1.5 px-3 bg-white border cursor-pointer border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-md transition-all flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-4 pr-7 space-y-1 custom-scrollbar animate-in fade-in zoom-in-[0.98] duration-500 ease-out">
          {chats?.map((chat: chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 border ${
                activeChatId === chat.id
                  ? 'bg-white border-slate-200 text-slate-800 font-medium'
                  : 'border-transparent text-slate-500 hover:bg-white hover:border-slate-200 hover:text-slate-800'
              }`}
            >
              <span className="truncate text-sm pr-2">{chat.title || 'Новый чат'}</span>
              {chats.length > 1 && (
                <button
                  onClick={e => handleDeleteChat(e, chat.id)}
                  disabled={deleteChatMutation.isPending}
                  className="cursor-pointer opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity p-1 -mr-1.5 shrink-0 disabled:opacity-50 rounded-md hover:bg-slate-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
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

      <div className="flex-1 relative flex flex-col items-center justify-center bg-transparent">
        {showChatArea && (
          <div className="absolute inset-0">
            <ChatArea key={activeChatId} chatId={activeChatId} initialMessages={initialMessages} />
          </div>
        )}
      </div>
    </div>
  );
}
