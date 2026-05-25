'use client'

import { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

type UserProfile = {
  id: string
  email: string
  nome: string | null
  role: string
}

export default function UsuariosPage() {
  const router = useRouter()
  const { data: session } = useSession()
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

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return
    }

    try {
      const response = await fetch(`/api/usuarios/${userId}`, {
        method: 'DELETE',
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao excluir usuário');
      }

      setUsers(users.filter((user) => user.id !== userId))
      toast.success(data.message || 'Usuário excluído com sucesso!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(message)
      console.error(err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Toaster position="top-right" />
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-amber-800">Gerenciar Usuários</h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push('/cadastro-usuarios')}
          className="bg-amber-700 text-white px-6 py-2.5 rounded-xl hover:bg-amber-800 transition-all shadow-md flex items-center gap-2 font-bold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Novo Usuário
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-amber-50 rounded-2xl p-12 text-center border border-amber-100">
          <p className="text-amber-700">Nenhum usuário cadastrado.</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-amber-900 text-lg leading-tight">{user.nome || 'Sem nome'}</h3>
                    <p className="text-sm text-amber-600">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                </div>

                {session?.user?.role === 'Admin' && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-amber-50">
                    <Link href={`/usuarios/editar/${user.id}`} className="flex-1">
                      <button className="w-full flex justify-center items-center gap-2 py-2 bg-amber-50 text-amber-700 rounded-lg font-bold text-sm hover:bg-amber-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      disabled={user.id === session?.user?.id}
                      className="flex-1 flex justify-center items-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 disabled:opacity-30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
            <table className="min-w-full divide-y divide-amber-100">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-amber-800 uppercase tracking-widest">Usuário</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-amber-800 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-amber-800 uppercase tracking-widest">Perfil</th>
                  {session?.user?.role === 'Admin' && (
                    <th className="px-6 py-4 text-right text-xs font-black text-amber-800 uppercase tracking-widest">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                          {user.nome?.[0] || 'U'}
                        </div>
                        <span className="font-bold text-amber-900">{user.nome || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-amber-700">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    {session?.user?.role === 'Admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/usuarios/editar/${user.id}`}>
                            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            disabled={user.id === session?.user?.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-20"
                            title="Excluir"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}