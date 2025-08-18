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

    console.log(`atualizarItem: campo=${campo}, valor=${valor}, typeof valor=${typeof valor}`);

    if (campo === 'produto_id') {
      const produto = produtos.find(p => p.id === valor);
      console.log('atualizarItem: produto encontrado', produto);
      if (produto) {
        item.preco_unitario = produto.preco;
        item.produto_id = produto.id; // Garante que o ID do produto seja usado
      }
    }

    if (campo === 'produto_id' || campo === 'quantidade') {
        item.total = (item.quantidade || 1) * (item.preco_unitario || 0);
    }

    novosItens[index] = item;
    setItens(novosItens);
    console.log('atualizarItem: item atualizado', item);
  };

  return (
    <div className="bg-amber-50 rounded-lg shadow-md p-6 mb-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-amber-800">Itens do Pedido</h2>
        <button
          className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors"
          onClick={adicionarItem}
        >
          Adicionar Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-amber-200">
          <thead className="bg-amber-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Qtd.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Preço Unit.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-amber-200">
            {itens.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap w-1/2">
                  <select
                    className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
                    value={item.produto_id}
                    onChange={(e) => {
                      const selectedProductId = e.target.value;
                      const selectedProduct = produtos.find(p => p.id === selectedProductId);
                      if (selectedProduct) {
                        atualizarItem(index, 'produto_id', selectedProduct.id);
                      } else {
                        atualizarItem(index, 'produto_id', ''); // Limpa se nada for selecionado
                      }
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
                    className="w-20 p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value, 10) || 1)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-amber-800">
                  R$ {(Number(item.preco_unitario) || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-amber-800">
                  R$ {(Number(item.total) || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                    onClick={() => removerItem(index)}
                  >
                    Remover
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
