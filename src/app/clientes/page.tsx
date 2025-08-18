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
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Gerenciar Clientes</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar cliente por nome..."
          className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-amber-700">Carregando clientes...</p>
      ) : clientes.length === 0 ? (
        <p className="text-center text-amber-700">Nenhum cliente encontrado.</p>
      ) : (
        <div className="overflow-x-auto bg-amber-50 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-amber-200">
            <thead className="bg-amber-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">{cliente.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{cliente.telefone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{cliente.endereco}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/clientes/editar/${cliente.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluirCliente(cliente.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
