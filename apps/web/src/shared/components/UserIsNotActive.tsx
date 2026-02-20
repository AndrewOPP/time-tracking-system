interface Props {
  onLogout: () => void;
}

export default function UserIsNotActive({ onLogout }: Props) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-[440px] bg-white p-10 rounded-[32px] border border-[#f0f0f0] shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-3">Account Inactive</h1>
        <p className="text-[#808080] mb-8 leading-relaxed">
          Your account is currently pending activation. Please wait for an administrator to approve
          your access.
        </p>

        <button
          onClick={() => onLogout()}
          className=" cursor-pointer w-full py-3.5 bg-black text-white rounded-xl font-medium hover:bg-zinc-800 transition-all active:scale-[0.98]"
        >
          Log out and try another account
        </button>
      </div>
    </div>
  );
}
