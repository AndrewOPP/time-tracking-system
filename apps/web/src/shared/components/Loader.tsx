interface LoaderProps {
  title?: string;
  description?: string;
  showBackendLink?: boolean;
}

const BACKEND_URL = import.meta.env.VITE_API_URL;

export default function Loader({ title, description, showBackendLink }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md transition-opacity p-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-b-black mb-4" />

      {title && <h2 className="mt-2 text-2xl font-bold text-slate-800">{title}</h2>}

      {description && <p className="text-gray-500 mt-2 max-w-md">{description}</p>}

      {showBackendLink && (
        <div className="mt-6 p-4 border rounded-lg bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-700 mb-2">You can monitor the startup status here:</p>
          <a
            href={BACKEND_URL}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline font-medium break-all"
          >
            {BACKEND_URL}
          </a>
        </div>
      )}
    </div>
  );
}
