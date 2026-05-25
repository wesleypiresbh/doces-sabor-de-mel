'use client'

import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error('Email ou senha inválidos.');
      } else {
        const session = await getSession();
        toast.success('Bem-vindo(a)!');
        if (session?.user?.role === 'Admin') {
          router.push('/dashboard');
        } else {
          router.push('/pedidos');
        }
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 px-4">
      <Toaster position="top-right" />
      
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-900/20">
          <svg className="w-10 h-10 text-amber-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21l-8-9 8-9 8 9-8 9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21l-8-9 8-9 8 9-8 9z" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-amber-800 tracking-tighter mb-1">Doces Sabor de Mel</h1>
        <p className="text-amber-600 font-medium">Sistema de Gestão de Pedidos</p>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-amber-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-amber-800"></div>
        
        <h2 className="text-xl font-bold text-amber-900 mb-8 text-center uppercase tracking-widest">Acessar Conta</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="w-full pl-10 pr-4 py-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Senha</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            className="w-full bg-amber-700 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-amber-800 transition-all shadow-lg shadow-amber-900/20 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2 mt-8"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </>
            ) : 'Entrar no Sistema'}
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-amber-700 text-sm font-medium opacity-60" suppressHydrationWarning>
        &copy; {new Date().getFullYear()} Doces Sabor de Mel
      </p>
    </div>
  )
}
