import { AlertCircle } from 'lucide-react';

export default function Alert({ message }: { message: string }) {
  return (
    <div
      className="animate-slide-up flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
      role="alert"
    >
      <AlertCircle size={16} className="shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  );
}
