import { getAvatarInitials } from '../../utils/getAvatarInitials';

interface FastProjectAvatarProps {
  src?: string;
  name: string;
}

export const FastProjectAvatar = ({ src, name }: FastProjectAvatarProps) => (
  <div className="relative h-4 w-4 rounded shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden">
    <span className="text-[8px] font-medium text-slate-500 select-none">
      {getAvatarInitials(name)}
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
