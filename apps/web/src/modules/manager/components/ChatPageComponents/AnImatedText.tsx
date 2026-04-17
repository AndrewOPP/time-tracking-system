import React, { useMemo } from 'react';

interface Props {
  text: string;
}

export const AnimatedText: React.FC<Props> = ({ text }) => {
  const words = useMemo(() => {
    return text.split(/(\s+)/);
  }, [text]);

  return (
    <span>
      {words.map((word, index) => (
        <span
          key={index}
          className="fade-in-word"
          style={{
            animationDelay: `${index * 20}ms`,
            animationFillMode: 'both',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};
