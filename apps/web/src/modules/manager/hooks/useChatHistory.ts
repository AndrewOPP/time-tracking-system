import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chatHistory.api';

export const useChatList = () => {
  return useQuery({
    queryKey: ['chat-history'],
    queryFn: chatApi.getChats,
  });
};

export const useChatMessages = (chatId: string | null) => {
  return useQuery({
    queryKey: ['chat-messages', chatId],
    queryFn: () => {
      if (!chatId) throw new Error('chatId is required');
      return chatApi.getMessages(chatId);
    },
    enabled: !!chatId,
    gcTime: 0,
    select: data =>
      // eslint-disable-next-line
      data.map((m: any) => ({
        id: String(m.id),
        role: m.role,
        content: m.content,
        parts: [{ type: 'text', text: m.content }],
      })),
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.deleteChat,
    onSuccess: () => {
      // Просто инвалидируем список. Компонент сам поймет, что активный чат исчез, и переключится
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
    },
  });
};

export const useInvalidateChatList = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['chat-history'] });
};

export const useCreateChat = (onSuccessCallback?: (newChatId: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.createChat,
    onSuccess: newChat => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
      if (onSuccessCallback) {
        onSuccessCallback(newChat.id);
      }
    },
  });
};
