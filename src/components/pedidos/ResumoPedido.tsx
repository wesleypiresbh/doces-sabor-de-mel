'use client'

import type { Cliente, ItemPedido } from '@/types'

interface ResumoPedidoProps {
  itens: ItemPedido[]
  clienteSelecionado: Cliente | null
  observacoes: string
  setObservacoes: (obs: string) => void
  onFinalizar: () => void
  onCancelar: () => void
}

export default function ResumoPedido({ 
  itens, 
  clienteSelecionado, 
  observacoes, 
  setObservacoes, 
  onFinalizar, 
  onCancelar 
}: ResumoPedidoProps) {

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + item.total, 0)
  }

  return (
    <>
      <div className="bg-amber-50 rounded-lg shadow-md p-6 mb-3">
        <h2 className="text-xl font-semibold mb-4 text-amber-800">Observações</h2>
        <textarea
          className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
          rows={3}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Informações adicionais sobre o pedido"
        />
      </div>

      <div className="bg-amber-50 rounded-lg shadow-md p-6 mb-3">
        <h2 className="text-xl font-semibold mb-4 text-amber-800">Resumo do Pedido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-800">
          <div>
            <p><strong>Status:</strong> Pendente</p>
            <p><strong>Cliente:</strong> {clienteSelecionado?.nome || 'Nenhum selecionado'}</p>
          </div>
          <div className="text-right">
            <p><strong>Total de Itens:</strong> {itens.length}</p>
            <p className="text-2xl font-bold">
              <strong>Total:</strong> R$ {calcularTotal().toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <button
          className="bg-amber-700 text-white px-6 py-2 rounded hover:bg-amber-800 transition-colors"
          onClick={onFinalizar}
          disabled={!clienteSelecionado || itens.length === 0}
        >
          Finalizar Pedido
        </button>
      </div>
    </>
  )
}
