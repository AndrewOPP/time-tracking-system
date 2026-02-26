import { Outlet } from 'react-router-dom';
import { Navigation } from '@components/Navigation';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden">
      <Navigation />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[56px] border-b-1 border-[#E5E5E5] bg-[#fafafa] flex items-center px-8 shrink-0" />
        <main className="flex-1 overflow-y-auto p-8 pt-0">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
