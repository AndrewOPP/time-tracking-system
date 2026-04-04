import { Outlet } from 'react-router-dom';
import { Navigation } from '@components/Navigation';

export function MainLayout() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      <Navigation />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:block h-[56px] border-b border-[#E5E5E5] bg-[#fafafa] shrink-0" />

        <main className="flex-1 overflow-y-auto p-4 md:pt-4 [scrollbar-gutter:stable]  custom-scrollbar">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
