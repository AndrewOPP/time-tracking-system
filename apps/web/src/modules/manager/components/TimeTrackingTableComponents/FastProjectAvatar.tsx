export const FastProjectAvatar = ({ src, name }: { src?: string; name: string }) => (
  <div className="relative h-4 w-4 rounded shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden">
    <span className="text-[8px] font-medium text-slate-500 select-none">
      {name.slice(0, 2).toUpperCase()}
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
