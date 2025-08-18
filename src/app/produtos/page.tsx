'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'

import { toast, Toaster } from 'react-hot-toast'
import type { Produto } from '@/types'

export default function GerenciarProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const carregarProdutos = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/produtos?busca=${searchTerm}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }
      const data = await response.json()
      console.log('Dados de produtos recebidos:', data); // Log para depuração
      setProdutos(data)
    } catch (error) {
      toast.error((error as Error).message)
      console.error('Erro ao carregar produtos:', error) // Log de erro mais detalhado
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    carregarProdutos()
  }, [carregarProdutos])

  const handleExcluirProduto = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Erro ao excluir produto');
        }
        toast.success('Produto excluído com sucesso!');
        carregarProdutos(); // Recarrega a lista após a exclusão
      } catch (error) {
        toast.error((error as Error).message);
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Gerenciar Produtos</h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar produto por nome ou código..."
          className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href="/produtos/novo" className="ml-4 bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors whitespace-nowrap">
          Novo Produto
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-amber-700">Carregando produtos...</p>
      ) : produtos.length === 0 ? (
        <p className="text-center text-amber-700">Nenhum produto encontrado.</p>
      ) : (
        <div className="overflow-x-auto bg-amber-50 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-amber-200">
            <thead className="bg-amber-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Estoque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Unidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Ativo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-200">
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">{produto.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{produto.nome}</td>
                  {/* MODIFICAÇÃO AQUI: Garante que preco é um número antes de formatar */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">
                    R$ {parseFloat(String(produto.preco)).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{produto.estoque}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{produto.unidade_medida}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{produto.ativo ? 'Sim' : 'Não'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/produtos/editar/${produto.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluirProduto(produto.id)}
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
