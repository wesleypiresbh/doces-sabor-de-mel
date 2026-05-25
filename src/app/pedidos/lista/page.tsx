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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendente': return 'bg-amber-100 text-amber-700';
      case 'concluido': return 'bg-green-100 text-green-700';
      case 'cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="printable-area">
      <div className="container mx-auto p-4">
        <Toaster position="top-right" />
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-amber-800">Lista de Pedidos</h1>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6 no-print">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir Lista
          </button>
          <Link 
            href="/pedidos" 
            className="flex items-center justify-center gap-2 bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors shadow-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Novo Pedido
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="bg-amber-50 rounded-xl p-12 text-center border border-amber-100 shadow-inner">
            <svg className="mx-auto h-12 w-12 text-amber-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-amber-700 text-lg">Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden no-print">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Pedido #{pedido.numero_pedido}</span>
                      <h3 className="font-bold text-amber-900 text-lg leading-tight">{pedido.cliente_nome}</h3>
                      {pedido.cliente_nome_empresa && (
                        <p className="text-sm text-amber-600 italic">{pedido.cliente_nome_empresa}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(pedido.status)}`}>
                      {pedido.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-amber-800">
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatarData(pedido.data_pedido)}
                    </div>
                    <div className="flex items-center gap-2 text-lg font-bold text-amber-900">
                      <span className="text-sm font-normal text-amber-600">Total:</span>
                      R$ {(Number(pedido.total) || 0).toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-amber-50">
                    <Link 
                      href={`/pedidos/detalhes/${pedido.id}`} 
                      className="flex items-center justify-center gap-2 w-full py-2 bg-amber-50 text-amber-700 rounded-lg font-medium hover:bg-amber-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View & Print: Table */}
            <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-sm border border-amber-100">
              <table className="min-w-full divide-y divide-amber-100">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Nº Pedido</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-amber-700 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-amber-700 uppercase tracking-wider no-print">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-50">
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-amber-900">#{pedido.numero_pedido}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700" suppressHydrationWarning>{formatarData(pedido.data_pedido)}</td>
                      <td className="px-6 py-4 text-sm text-amber-700">
                        <div className="font-medium text-amber-900">{pedido.cliente_nome}</div>
                        {pedido.cliente_nome_empresa && <div className="text-xs text-amber-500 italic">{pedido.cliente_nome_empresa}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(pedido.status)}`}>
                          {pedido.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-amber-900">R$ {(Number(pedido.total) || 0).toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium no-print">
                        <Link href={`/pedidos/detalhes/${pedido.id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
