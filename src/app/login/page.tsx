'use client'

import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast' // Importar Toaster e toast

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Novo estado de carregamento
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false, // Não redireciona automaticamente
        email,
        password,
      });

      if (result?.error) {
        toast.error('Email ou senha inválidos.'); // Mensagem de erro genérica
      } else {
        const session = await getSession();
        toast.success('Login realizado com sucesso!');
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
    <div className="min-h-screen flex items-center justify-center bg-yellow-100">
      <Toaster position="top-right" /> {/* Adicionar o Toaster */}
      <div className="bg-amber-50 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-amber-800">Doces Sabor de Mel</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-800">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading} // Desabilitar input durante o carregamento
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-800">Senha</label>
            <input
              type="password"
              className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} // Desabilitar input durante o carregamento
            />
          </div>
          <button
            className="w-full bg-amber-700 text-white p-2 rounded hover:bg-amber-800 transition-colors"
            onClick={handleLogin}
            disabled={isLoading} // Desabilitar botão durante o carregamento
          >
            {isLoading ? 'Entrando...' : 'Entrar'} {/* Texto dinâmico */}
          </button>
        </div>
      </div>
    </div>
  )
}
