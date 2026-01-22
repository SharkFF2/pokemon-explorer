interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg border border-slate-600 animate-pulse">
      {message}
    </div>
  );
}