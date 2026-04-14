import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/ui/sheet';
import { useChatList, useDeleteChat, useCreateChat } from '../hooks/useChatHistory';
import { ChatArea } from '../components/ChatPageComponents/ChatArea';

interface chat {
  id: string;
  title: string;
  updatedAt: string;
}

const STORAGE_KEY = 'manager_active_chat_id';

export function ManagerAIChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatId = searchParams.get('chatId');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [openedChats, setOpenedChats] = useState<string[]>([]);

  const { data: chats, isLoading: isChatsLoading } = useChatList();
  const createChatMutation = useCreateChat();
  const deleteChatMutation = useDeleteChat();

  useEffect(() => {
    if (activeChatId) return;

    const savedChatId = sessionStorage.getItem(STORAGE_KEY);

    if (savedChatId) {
      setSearchParams({ chatId: savedChatId }, { replace: true });
    }
  });

  useEffect(() => {
    if (activeChatId) {
      sessionStorage.setItem(STORAGE_KEY, activeChatId);
    }
  }, [activeChatId]);

  useEffect(() => {
    if (!chats) return;

    const chatExistsInDb = chats.some((c: chat) => c.id === activeChatId);

    if (activeChatId && chatExistsInDb) {
      // eslint-disable-next-line
      setOpenedChats(prev => {
        if (prev.includes(activeChatId)) return prev;
        return [...prev, activeChatId];
      });
    }
  }, [activeChatId, chats]);

  useEffect(() => {
    if (isChatsLoading || !chats || chats.length === 0) return;

    const isCurrentChatValid = activeChatId && chats.some((c: chat) => c.id === activeChatId);

    if (!isCurrentChatValid) {
      const savedChatId = sessionStorage.getItem(STORAGE_KEY);
      const isSavedValid = savedChatId && chats.some((c: chat) => c.id === savedChatId);

      if (isSavedValid) {
        setSearchParams({ chatId: savedChatId! }, { replace: true });
      } else {
        setSearchParams({ chatId: chats[0].id }, { replace: true });
      }
    }
  }, [chats, isChatsLoading, activeChatId, setSearchParams]);

  const handleNewChat = () => {
    if (!createChatMutation.isPending) {
      createChatMutation.mutate();
      setIsMobileOpen(false);
    }
  };

  const handleDeleteChat = (e: React.MouseEvent, chatIdToDelete: string) => {
    e.stopPropagation();
    if (!chats) return;

    setOpenedChats(prev => prev.filter(id => id !== chatIdToDelete));

    if (activeChatId === chatIdToDelete) {
      const currentIndex = chats.findIndex((c: chat) => c.id === chatIdToDelete);
      const prevId = chats[currentIndex - 1]?.id;
      const nextId = chats[currentIndex + 1]?.id;
      const nextActiveId = prevId || nextId || null;

      if (nextActiveId) {
        setSearchParams({ chatId: nextActiveId }, { replace: true });
      } else {
        searchParams.delete('chatId');
        setSearchParams(searchParams, { replace: true });
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    deleteChatMutation.mutate(chatIdToDelete);
  };

  const renderSidebarContent = (isMobile: boolean = false) => (
    <div className={`flex flex-col h-full bg-transparent ${isMobile ? 'p-4' : 'pb-0 pl-0 pr-7'}`}>
      <div className={`pb-3 ${!isMobile && 'p-4 pr-0 pl-0'}`}>
        <button
          onClick={handleNewChat}
          disabled={createChatMutation.isPending || isChatsLoading}
          className="w-full py-1.5 pr-0 bg-white border cursor-pointer border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-md transition-all flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
        >
          + New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 space-y-1 custom-scrollbar animate-in fade-in zoom-in-[0.98] duration-500 ease-out">
        {chats?.map((chat: chat) => (
          <div
            key={chat.id}
            onClick={() => {
              setSearchParams({ chatId: chat.id }, { replace: true });
              setIsMobileOpen(false);
            }}
            className={`group flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer transition-all duration-200 border 
    min-h-[38px] 
    ${
      activeChatId === chat.id
        ? 'bg-white border-slate-200 text-slate-800 font-medium'
        : 'border-transparent text-slate-500 hover:bg-white hover:border-slate-200 hover:text-slate-800'
    }`}
          >
            <span className="truncate text-sm pr-2">{chat.title || 'Новый чат'}</span>

            <div className="flex items-center justify-center w-5 h-5 shrink-0">
              {chats.length > 1 && (
                <button
                  onClick={e => handleDeleteChat(e, chat.id)}
                  disabled={deleteChatMutation.isPending}
                  className="cursor-pointer opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity p-1 -mr-1.5 shrink-0 disabled:opacity-50 rounded-md"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-[1000px]:flex-row h-[calc(100vh-100px)] w-full overflow-hidden bg-white font-sans">
      <div className="flex min-[1000px]:hidden items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0 bg-white z-10">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <button className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] border-r border-slate-200">
            <SheetTitle className="sr-only">Chat History</SheetTitle>
            <SheetDescription className="sr-only">Mobile chat history navigation</SheetDescription>
            {renderSidebarContent(true)}
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-slate-800 text-sm">Chats</span>
      </div>

      <div className="hidden min-[1000px]:flex w-[240px] shrink-0 border-r border-slate-200 flex-col">
        {renderSidebarContent(false)}
      </div>

      <div className="flex-1 relative flex flex-col items-center justify-center h-full">
        {openedChats.map(id => (
          <div
            key={id}
            className={`absolute inset-0 ${activeChatId === id ? 'block z-10' : 'hidden z-0'}`}
          >
            <ChatArea chatId={id} />
          </div>
        ))}
      </div>
    </div>
  );
}
