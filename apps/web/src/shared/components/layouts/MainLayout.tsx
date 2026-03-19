import { Outlet } from 'react-router-dom';

import { Navigation } from '@components/Navigation';

export function MainLayout() {
  return (
    <div className="flex h-screen  bg-white">
      <aside className="w-64 shrink-0 border-r border-[#E5E5E5] h-full">
        <Navigation />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[56px] border-b border-[#E5E5E5] bg-[#fafafa] shrink-0" />

        <main className="flex-1 overflow-y-auto p-4 pt-0">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
