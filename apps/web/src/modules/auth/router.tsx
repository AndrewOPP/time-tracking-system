import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { OAuthCallback } from './components/OAuthCallback';

export const AuthRoutes = () => (
  <Routes>
    <Route path="login" element={<LoginPage />} />
    <Route path="oauth/callback" element={<OAuthCallback />} />
  </Routes>
);
