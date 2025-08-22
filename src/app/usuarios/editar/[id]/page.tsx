'use client'

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

type UserData = {
  nome: string;
  email: string;
  role: string;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<UserData>({ nome: '', email: '', role: 'User' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/usuarios/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao carregar dados do usuário.');
        }
        const data = await response.json();
        setUser(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Falha ao carregar dados do usuário.';
        toast.error(message);
        router.push('/usuarios'); // Volta se não encontrar o usuário
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Falha ao atualizar usuário.');
      }

      toast.success(data.message);
      setTimeout(() => router.push('/usuarios'), 1500);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Falha ao atualizar usuário.';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Editar Usuário</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={user.nome}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Perfil</label>
          <select
            id="role"
            name="role"
            value={user.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => router.push('/usuarios')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                Cancelar
            </button>
            <button type="submit" disabled={isSaving} className="bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800 disabled:bg-gray-400">
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </div>
      </form>
    </div>
  );
}
