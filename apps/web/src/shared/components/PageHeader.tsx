import { cn } from '@/shared/lib/utils';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export const PageHeader = ({ title, description, className, children }: PageHeaderProps) => {
  return (
    <div className={cn('py-[20px] px-[16px] mb-6 border-b border-gray-200', className)}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-[10px]">
          {/* Заголовок: Exo 2, Bold, 18px, Line-height 100%, #1F1F1F */}
          <h1 className="font-exo font-bold text-[18px] leading-none text-[#1F1F1F]">{title}</h1>

          {/* Описание: Onest, Regular (400), 14px, Line-height 100%, #6F6F6F */}
          {description && (
            <p className="font-onest font-normal text-[14px] leading-none text-[#6F6F6F]">
              {description}
            </p>
          )}
        </div>

        {children && <div>{children}</div>}
      </div>
    </div>
  );
};
