export const FastUserAvatar = ({
  src,
  name,
  className = 'h-5 w-5',
}: {
  src?: string;
  name: string;
  className?: string;
}) => (
  <div
    className={`relative rounded-full shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden ${className}`}
  >
    <span className="text-[10px] font-medium text-slate-500 select-none">
      {(name || 'U').slice(0, 2).toUpperCase()}
    </span>
    {src && (
      <img
        src={src}
        alt={name}
        decoding="async"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    )}
  </div>
);
