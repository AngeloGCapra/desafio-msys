import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function AuthLayout({ title, icon, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 px-4">
      <div className="animate-scale-in w-full max-w-sm rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
        {icon && (
          <div className="mb-4 flex justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              {icon}
            </span>
          </div>
        )}
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">{title}</h1>
        {children}
      </div>
    </div>
  );
}
