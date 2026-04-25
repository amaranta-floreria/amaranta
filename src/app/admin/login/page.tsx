'use client';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Flower2 } from 'lucide-react';

export default function LoginPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) router.replace('/admin');
      else setError('Esta cuenta no tiene acceso al panel de administración.');
    }
  }, [user, loading, isAdmin, router]);

  async function handleGoogleSignIn() {
    setError('');
    setSigning(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError('No se pudo iniciar sesión. Intenta de nuevo.');
      setSigning(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fdfaf8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flower2 className="w-6 h-6 text-rose-400" strokeWidth={1.5} />
            <span className="text-xl tracking-wide text-gray-800">Amaranta</span>
          </div>
          <p className="text-sm text-gray-400 tracking-wide">Panel de administración</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-rose-100 p-8 shadow-sm">
          <h1 className="text-lg text-gray-800 font-medium mb-1">Iniciar sesión</h1>
          <p className="text-sm text-gray-400 mb-8">Usa tu cuenta de Google autorizada.</p>

          <button
            onClick={handleGoogleSignIn}
            disabled={signing || loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {signing ? 'Iniciando sesión…' : 'Continuar con Google'}
          </button>

          {error && (
            <p className="mt-4 text-sm text-center text-rose-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
