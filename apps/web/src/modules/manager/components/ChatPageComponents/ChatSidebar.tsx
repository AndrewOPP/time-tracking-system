import React from 'react';

interface Chat {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  chats: Chat[] | undefined;
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  handleNewChat: () => void;
  handleDeleteChat: (e: React.MouseEvent, chatId: string) => void;
  isCreating: boolean;
  isChatsLoading: boolean;
  isDeleting: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChatId,
  setActiveChatId,
  handleNewChat,
  handleDeleteChat,
  isCreating,
  isChatsLoading,
  isDeleting,
}) => {
  return (
    <div className="w-72 border-r border-slate-100 bg-white flex flex-col h-full shadow-[2px_0_8px_rgba(0,0,0,0,02)]">
      <div className="p-4">
        <button
          onClick={handleNewChat}
          disabled={isCreating || isChatsLoading}
          className="w-full py-2.5 px-4 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-50"
        >
          {isCreating ? (
            <span className="text-xs uppercase tracking-wider animate-pulse">Creating...</span>
          ) : (
            <>
              <span className="text-lg leading-none">+</span> New chat
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5 custom-scrollbar">
        {chats?.map(chat => (
          <div
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`group relative p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
              activeChatId === chat.id
                ? 'bg-blue-50/60 text-blue-700 shadow-sm'
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 ${activeChatId === chat.id ? 'text-blue-500' : 'text-slate-300'}`}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="truncate text-[13px] font-medium leading-relaxed">
                {chat.title || 'Untitled chat'}
              </span>
            </div>

            <button
              onClick={e => handleDeleteChat(e, chat.id)}
              disabled={isDeleting}
              className={`opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 hover:text-red-500 transition-all ${
                activeChatId === chat.id ? 'text-blue-400' : 'text-slate-300'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
