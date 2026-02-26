export const formatToEnglishDate = (dateString?: string | Date | null) => {
  if (!dateString) return '—';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
