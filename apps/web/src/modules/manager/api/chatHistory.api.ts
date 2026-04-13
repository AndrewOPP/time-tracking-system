import { axiosPrivate } from '@/shared/api';

export const chatApi = {
  getChats: async () => {
    const { data } = await axiosPrivate.get('/chat-history');
    return data;
  },

  getMessages: async (chatId: string) => {
    const { data } = await axiosPrivate.get(`/chat-history/${chatId}/messages`);
    return data;
  },

  createChat: async () => {
    const { data } = await axiosPrivate.post('/chat-history');
    return data;
  },

  deleteChat: async (chatId: string) => {
    const { data } = await axiosPrivate.delete(`/chat-history/${chatId}`);
    return data;
  },
};
