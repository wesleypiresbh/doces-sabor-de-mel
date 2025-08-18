'use client'

import { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// Tipo para o perfil do usuário
type UserProfile = {
  id: string
  email: string
  nome: string | null
  // Remover celular e role
  // celular: string | null
  // role: string
}

export default function UsuariosPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/usuarios')
        if (!response.ok) {
          throw new Error('Erro ao carregar usuários.')
        }
        const data = await response.json()
        setUsers(data as UserProfile[])
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar usuários.';
        setError(message)
        toast.error(message)
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100 text-amber-800">
        <p>Carregando usuários...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-100 text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Gerenciar Usuários</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push('/cadastro-usuarios')}
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors"
        >
          Cadastrar Usuário
        </button>
      </div>

      <div className="bg-amber-50 rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-200">
            <thead className="bg-amber-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Email</th>
                {/* Remover Celular e Perfil */}
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Celular</th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Perfil</th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Ações</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-amber-800">{user.nome || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-amber-800">{user.email}</td>
                  {/* Remover celular e role */}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-amber-800">{user.celular || 'N/A'}</td> */}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-amber-800">{user.role}</td> */}
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <button className="bg-blue-500 text-white p-2 rounded">Editar</button>
                    <button className="bg-red-500 text-white p-2 rounded ml-2">Excluir</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}