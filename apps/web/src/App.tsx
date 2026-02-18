import { RouterProvider } from 'react-router-dom';
import { router } from '@/shared/config/router';
import { Toaster } from '@/shared/components/ui';

export function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
