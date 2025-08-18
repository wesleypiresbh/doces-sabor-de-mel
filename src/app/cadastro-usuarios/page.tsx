'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { toast, Toaster } from 'react-hot-toast'

export default function CadastroUsuarioPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('') // Novo estado para Nome
  const [celular, setCelular] = useState('') // Novo estado para Celular
  const [profile, setProfile] = useState('User') // Default profile
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    let masked = '';

    if (input.length > 0) {
      masked = `(${input.substring(0, 2)}`;
    }
    if (input.length > 2) {
      masked += `) ${input.substring(2, 7)}`;
    }
    if (input.length > 7) {
      masked += `-${input.substring(7, 11)}`;
    }

    setCelular(masked);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar usuário');
      }

      toast.success('Usuário cadastrado com sucesso!');
      setTimeout(() => {
        router.push('/login'); // Redireciona para a página de login após o sucesso
      }, 1500);

    } catch (error: unknown) {
      let message = 'Erro ao cadastrar usuário.';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-100">
      <Toaster position="top-right" />
      <div className="bg-amber-50 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-amber-800">Cadastro de Usuário</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-800">Nome</label>
            <input
              type="text"
              className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-800">Celular</label>
            <input
              type="text"
              className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
              value={celular}
              onChange={handleCelularChange}
              maxLength={15} // (XX) XXXXX-XXXX
              placeholder="(XX) XXXXX-XXXX"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-800">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-800">Senha</label>
            <input
              type="password"
              className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-amber-800">Perfil</label>
            <select
              className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              disabled={isLoading}
            >
              <option value="User">User</option>
              <option value="Operador">Operador</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-amber-700 text-white p-2 rounded hover:bg-amber-800 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar Usuário'}
          </button>
        </form>
      </div>
    </div>
  )
}
