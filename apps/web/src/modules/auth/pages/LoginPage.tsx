import { useState } from 'react';
import { OAuthLoginButton } from '../components/OAuthLoginButton';
import { OAUTH_LIST } from '../types/auth.types';
import { firstCharToUpperCase } from '@/shared/utils/firstCharToUpperCase';

export function LoginPage() {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

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

        <div className="flex flex-col gap-3">
          {OAUTH_LIST.map(({ provider, icon }) => (
            <OAuthLoginButton
              setGlobalLoading={setIsOAuthLoading}
              key={provider}
              provider={provider}
              isGlobalLoading={isOAuthLoading}
              icon={icon}
              className="flex items-center justify-center gap-3 w-full py-3.5 border-2 cursor-pointer border-[#e5e5e5] rounded-xl hover:bg-[#f9f9f9] transition-all duration-200 active:scale-[0.98]"
            >
              Sign in with {firstCharToUpperCase(provider)}
            </OAuthLoginButton>
          ))}
        </div>
      </div>
    </div>
  );
}
