import { cn } from '@lib/utils';
import { getAvatarInitials } from '../../utils/getAvatarInitials';

interface FastUserAvatarProps {
  src?: string;
  name: string;
  className?: string;
}

export const FastUserAvatar = ({ src, name, className = 'h-5 w-5' }: FastUserAvatarProps) => (
  <div
    className={cn(
      'relative rounded-full shrink-0 bg-slate-100 flex items-center justify-center overflow-hidden',
      className
    )}
  >
    <span className="text-[10px] font-medium text-slate-500 select-none">
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
