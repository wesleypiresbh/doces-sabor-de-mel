'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import Link from 'next/link'

interface Pedido {
  id: string;
  numero_pedido: number;
  data_pedido: string;
  cliente_nome: string;
  cliente_nome_empresa: string | null;
  status: string;
  total: number;
  observacoes: string | null;
}

export default function ListaPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  const carregarPedidos = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pedidos')
      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos')
      }
      const data = await response.json()
      setPedidos(data)
    } catch (error) {
      toast.error((error as Error).message)
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarPedidos()
  }, [carregarPedidos])

  const formatarData = (dataString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="printable-area">
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Lista de Pedidos</h1>

        <div className="flex justify-end mb-4 no-print">
          <button
            onClick={() => window.print()}
            className="mr-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Imprimir Lista
          </button>
          <Link href="/pedidos" className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors whitespace-nowrap">
            Novo Pedido
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-amber-700">Carregando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p className="text-center text-amber-700">Nenhum pedido encontrado.</p>
        ) : (
          <div className="overflow-x-auto bg-amber-50 rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-amber-200">
              <thead className="bg-amber-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Pedido Numero</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider no-print">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-200">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">{pedido.numero_pedido}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{formatarData(pedido.data_pedido)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">
                      {pedido.cliente_nome} {pedido.cliente_nome_empresa ? `(${pedido.cliente_nome_empresa})` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{pedido.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">R$ {(Number(pedido.total) || 0).toFixed(2).replace('.', ',')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium no-print">
                      <Link href={`/pedidos/detalhes/${pedido.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
