'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { toast, Toaster } from 'react-hot-toast'
import type { Cliente } from '@/types'

export default function GerenciarClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const carregarClientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clientes?busca=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar clientes');
      }
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    carregarClientes()
  }, [carregarClientes])

  const handleExcluirCliente = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const response = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Erro ao excluir cliente');
        }
        toast.success('Cliente excluído com sucesso!');
        carregarClientes(); // Recarrega a lista após a exclusão
      } catch (error) {
        toast.error((error as Error).message);
        console.error(error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-amber-800">Gerenciar Clientes</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar cliente por nome..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link 
          href="/clientes/novo" 
          className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors shadow-sm flex items-center justify-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Novo Cliente
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
        </div>
      ) : clientes.length === 0 ? (
        <div className="bg-amber-50 rounded-xl p-12 text-center border border-amber-100 shadow-inner">
          <svg className="mx-auto h-12 w-12 text-amber-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-amber-700 text-lg">Nenhum cliente encontrado.</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-amber-900 text-lg">{cliente.nome}</h3>
                  <div className="flex gap-2">
                    <Link
                      href={`/clientes/editar/${cliente.id}`}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                      title="Editar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleExcluirCliente(cliente.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Excluir"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-amber-800">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {cliente.telefone || 'Sem telefone'}
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="flex-1">{cliente.endereco || 'Sem endereço'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-sm border border-amber-100">
            <table className="min-w-full divide-y divide-amber-100">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Endereço</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-amber-700 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-50">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">{cliente.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{cliente.telefone}</td>
                    <td className="px-6 py-4 text-sm text-amber-700 max-w-xs truncate">{cliente.endereco}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/clientes/editar/${cliente.id}`}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </Link>
                        <button
                          onClick={() => handleExcluirCliente(cliente.id)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Apagar
                        </button>
                      </div>
                    </td>
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
