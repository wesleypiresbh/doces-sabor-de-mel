'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import type { Produto, ItemPedido } from '@/types'

interface ItensPedidoProps {
  itens: ItemPedido[]
  setItens: (itens: ItemPedido[]) => void
}

export default function ItensPedido({ itens, setItens }: ItensPedidoProps) {
  const [produtos, setProdutos] = useState<Produto[]>([])

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const response = await fetch('/api/produtos');
        if (!response.ok) {
          throw new Error('Erro ao carregar produtos');
        }
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    carregarProdutos();
  }, []);

  const adicionarItem = () => {
    setItens([...itens, { produto_id: '', quantidade: 1, preco_unitario: 0, total: 0 }])
  }

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index))
  }

  const atualizarItem = (index: number, campo: keyof ItemPedido, valor: string | number) => {
    const novosItens = [...itens];
    const item = { ...novosItens[index], [campo]: valor };

    if (campo === 'produto_id') {
      const produto = produtos.find(p => p.id === valor);
      if (produto) {
        item.preco_unitario = produto.preco;
        item.produto_id = produto.id;
      }
    }

    if (campo === 'produto_id' || campo === 'quantidade') {
        item.total = (item.quantidade || 1) * (item.preco_unitario || 0);
    }

    novosItens[index] = item;
    setItens(novosItens);
  };

  return (
    <div className="bg-amber-50 rounded-lg shadow-md p-4 md:p-6 mb-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-amber-800">Itens do Pedido</h2>
        <button
          className="w-full sm:w-auto bg-amber-700 text-white px-6 py-2 rounded-md hover:bg-amber-800 transition-colors shadow-sm flex items-center justify-center gap-2"
          onClick={adicionarItem}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Adicionar Item
        </button>
      </div>

      {/* Mobile View: Cards */}
      <div className="md:hidden space-y-4">
        {itens.length === 0 && (
          <p className="text-center text-amber-600 italic py-4">Nenhum item adicionado.</p>
        )}
        {itens.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm relative">
            <button
              className="absolute top-2 right-2 text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
              onClick={() => removerItem(index)}
              title="Remover item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-amber-700 uppercase mb-1">Produto</label>
                <select
                  className="w-full p-2.5 border rounded-md border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-amber-800 bg-amber-50/50"
                  value={item.produto_id}
                  onChange={(e) => {
                    const selectedProductId = e.target.value;
                    atualizarItem(index, 'produto_id', selectedProductId);
                  }}
                >
                  <option value="">Selecione um produto</option>
                  {produtos.map(produto => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-700 uppercase mb-1">Quantidade</label>
                  <input
                    type="number"
                    className="w-full p-2.5 border rounded-md border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-amber-800"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value, 10) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-700 uppercase mb-1">Preço Unit.</label>
                  <div className="p-2.5 text-amber-800 font-medium">
                    R$ {(Number(item.preco_unitario) || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-amber-800">Total do Item:</span>
                <span className="text-lg font-bold text-amber-900">
                  R$ {(Number(item.total) || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-amber-200">
          <thead className="bg-amber-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Qtd.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Preço Unit.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-amber-800 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-amber-200">
            {itens.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-amber-600 italic">Nenhum item adicionado. Clique em "Adicionar Item".</td>
              </tr>
            )}
            {itens.map((item, index) => (
              <tr key={index} className="hover:bg-amber-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-amber-800"
                    value={item.produto_id}
                    onChange={(e) => {
                      const selectedProductId = e.target.value;
                      atualizarItem(index, 'produto_id', selectedProductId);
                    }}
                  >
                    <option value="">Selecione um produto</option>
                    {produtos.map(produto => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    className="w-20 p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-amber-800"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value, 10) || 1)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-amber-800 font-medium">
                  R$ {(Number(item.preco_unitario) || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-amber-800 font-bold">
                  R$ {(Number(item.total) || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                    onClick={() => removerItem(index)}
                    title="Remover item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
