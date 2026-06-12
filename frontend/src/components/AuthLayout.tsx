import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 px-4">
      <div className="animate-scale-in w-full max-w-sm rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">{title}</h1>
        {children}
      </div>
    </div>
  );
}
