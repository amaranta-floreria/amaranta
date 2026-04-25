'use client';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    const onLoginPage = pathname === '/admin/login';
    if (!user && !onLoginPage) router.replace('/admin/login');
    if (user && isAdmin && onLoginPage) router.replace('/admin');
  }, [user, loading, isAdmin, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfaf8] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-rose-300 border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
