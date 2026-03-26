import { UIMessage } from 'ai';

export const cleanMessages = (messages: UIMessage[]) => {
  return messages
    .filter(msg => msg.role === 'user' || msg.role === 'assistant')
    .map(msg => ({
      ...msg,
      parts: msg.parts?.filter(p => p.type === 'text') || [],
    }))
    .filter(msg => msg.parts.length > 0);
};
