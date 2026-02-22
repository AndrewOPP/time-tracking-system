import { Outlet } from 'react-router-dom';
import { Navigation } from '@components/Navigation';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <Navigation />
      <main className="flex-1 min-h-screen transition-all duration-300 overflow-y-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
