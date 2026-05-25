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
      setProdutos(data)
    } catch (error) {
      toast.error((error as Error).message)
      console.error('Erro ao carregar produtos:', error)
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
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-amber-800">Gerenciar Produtos</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-500">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar produto por nome ou código..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link 
          href="/produtos/novo" 
          className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors shadow-sm flex items-center justify-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Novo Produto
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
        </div>
      ) : produtos.length === 0 ? (
        <div className="bg-amber-50 rounded-xl p-12 text-center border border-amber-100 shadow-inner">
          <svg className="mx-auto h-12 w-12 text-amber-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-amber-700 text-lg">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtos.map((produto) => (
            <div key={produto.id} className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 hover:shadow-md transition-shadow relative overflow-hidden">
              {!produto.ativo && (
                <div className="absolute top-0 right-0 bg-red-100 text-red-600 px-3 py-1 text-xs font-bold rounded-bl-lg">
                  Inativo
                </div>
              )}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-amber-900 text-lg leading-tight mb-1">{produto.nome}</h3>
                  <p className="text-xs text-amber-500 font-mono">#{produto.codigo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-amber-50 rounded-lg p-2">
                  <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">Preço</p>
                  <p className="text-amber-900 font-bold">R$ {parseFloat(String(produto.preco)).toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2">
                  <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">Estoque</p>
                  <p className="text-amber-900 font-bold">{produto.estoque} <span className="text-xs font-normal text-amber-700">{produto.unidade_medida}</span></p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-amber-50">
                <div className="flex gap-2">
                  <Link
                    href={`/produtos/editar/${produto.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </Link>
                </div>
                <button
                  onClick={() => handleExcluirProduto(produto.id)}
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
