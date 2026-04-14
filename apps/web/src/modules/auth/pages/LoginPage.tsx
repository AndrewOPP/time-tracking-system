import { useState } from 'react';
import { OAuthLoginButton } from '../components/OAuthLoginButton';
import { OAUTH_LIST } from '../types/auth.types';
import { firstCharToUpperCase } from '@/shared/utils/firstCharToUpperCase';
import { useNavigate } from 'react-router-dom';
import { loginAsGuest } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';

export function LoginPage() {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    const { data } = await loginAsGuest();
    localStorage.setItem('accessToken', data.accessToken);

    setAuth(data.user, data.accessToken);
    navigate('/manager/dashboard');

    setIsGuestLoading(false);
  };

  const isLoading = isOAuthLoading || isGuestLoading;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] font-sans antialiased">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-black p-2 rounded-lg">
          <div className="w-5 h-5 bg-white rounded-sm" />
        </div>
        <span className="text-3xl font-bold tracking-tight text-[#1a1a1a]">Viso Time Tracker</span>
      </div>
      <div className="w-full max-w-[400px] bg-white p-10 rounded-[32px] border border-[#f0f0f0] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="text-center mb-10">
          <h1 className="text-[28px] font-bold text-[#1a1a1a] mb-3">Welcome</h1>
          <p className="text-[#808080] text-[18px]">
            Focus on — <span className="text-[#4b7c52] font-medium">What matters</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-3">
          {OAUTH_LIST.map(({ provider, icon }) => (
            <OAuthLoginButton
              setGlobalLoading={setIsOAuthLoading}
              key={provider}
              provider={provider}
              isGlobalLoading={isLoading}
              icon={icon}
              className={`flex items-center justify-center gap-3 w-full py-3.5 border-2 border-[#e5e5e5] rounded-xl transition-all duration-200 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#f9f9f9] active:scale-[0.98]'}`}
            >
              Sign in with {firstCharToUpperCase(provider)}
            </OAuthLoginButton>
          ))}
        </div>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-[#f0f0f0]"></div>
          <span className="flex-shrink-0 mx-4 text-[#a0a0a0] text-sm">or</span>
          <div className="flex-grow border-t border-[#f0f0f0]"></div>
        </div>

        <button
          onClick={handleGuestLogin}
          disabled={isLoading}
          className={`w-full py-3.5 bg-[#4b7c52] text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center
            ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#3a5f3f] active:scale-[0.98]'}`}
        >
          {isGuestLoading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
          {isGuestLoading ? 'Creating workspace...' : 'Sign in as a guest'}
        </button>
      </div>
    </div>
  );
}
