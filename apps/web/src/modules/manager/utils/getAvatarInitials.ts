export const getAvatarInitials = (name: string) => {
  return (name || 'U').slice(0, 2).toUpperCase();
};
