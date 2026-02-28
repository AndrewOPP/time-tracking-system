import { axiosPublic } from '@/shared/api';
import type { Message } from '../types/managerAIChat.types';
import { extractApiError } from '@/shared/utils/extractApiError';

export const getChatAnswer = async (messages: Message[]) => {
  try {
    const { data } = await axiosPublic.post('/chat', {
      messages: messages,
    });

    // Успіх: повертаємо дані, помилки немає
    return { data, error: null };
  } catch (err: unknown) {
    // Помилка: витягуємо повідомлення і повертаємо його
    const errorMsg = extractApiError(err, 'AI_CHAT_FAILED');
    console.error('Chat failed:', errorMsg);

    return { data: null, error: errorMsg };
  }
};
