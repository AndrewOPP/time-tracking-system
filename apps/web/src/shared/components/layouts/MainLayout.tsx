import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from '@components/Navigation';

export function MainLayout() {
  const location = useLocation();

  // Проверяем, находимся ли мы на странице чата.
  // ВАЖНО: Замените '/chat' на ваш реальный путь из роутера!
  const isChatPage = location.pathname.includes('/ai-chat');

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      <Navigation />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:block h-[56px] border-b border-[#E5E5E5] bg-[#fafafa] shrink-0" />

        {/* Убираем p-4 для страницы чата, чтобы она прилипла вплотную к краям экрана */}
        <main
          className={`flex-1 overflow-y-auto [scrollbar-gutter:stable] custom-scrollbar p-4 ${
            isChatPage ? '' : ' md:pt-4'
          }`}
        >
          {/* Отключаем max-w и центрирование для чата, но оставляем для остальных страниц */}
          <div className={isChatPage ? 'w-full h-full' : 'max-w-[1600px] mx-auto w-full'}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
