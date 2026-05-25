'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

interface PedidoDetalhe {
  id: string;
  numero_pedido: number;
  data_pedido: string;
  status: string;
  total: number;
  observacoes: string | null;
  cliente_nome: string;
  cliente_nome_empresa: string | null;
  cliente_email: string;
  cliente_telefone: string;
  cliente_endereco: string;
  itens: {
    quantidade: number;
    preco_unitario: number;
    produto_nome: string;
    produto_codigo: string;
  }[];
}

export default function DetalhesPedidoPage() {
  const [pedido, setPedido] = useState<PedidoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchPedido = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/pedidos/${id}`);
          if (!response.ok) {
            throw new Error('Pedido não encontrado');
          }
          const data = await response.json();
          setPedido(data);
        } catch (error) {
          toast.error((error as Error).message);
          router.push('/pedidos/lista');
        } finally {
          setLoading(false);
        }
      };
      fetchPedido();
    }
  }, [id, router]);

  const formatarData = (dataString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendente': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'concluido': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelado': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container mx-auto p-4 text-center py-20">
        <h2 className="text-2xl font-bold text-amber-800 mb-4">Pedido não encontrado</h2>
        <button onClick={() => router.push('/pedidos/lista')} className="text-amber-600 hover:underline">
          Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 printable-area">
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden max-w-4xl mx-auto">
        {/* Top Bar / Header Section */}
        <div className="bg-amber-800 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-700/50 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Comprovante de Pedido</span>
              </div>
              <h1 className="text-3xl font-black">#{pedido.numero_pedido}</h1>
              <p className="text-amber-100 opacity-90">{formatarData(pedido.data_pedido)}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 font-bold uppercase tracking-widest text-sm bg-white/10 backdrop-blur-sm`}>
              {pedido.status}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Informações do Cliente */}
            <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100">
              <h2 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Dados do Cliente
              </h2>
              <div className="space-y-3 text-amber-900">
                <div>
                  <p className="text-xs font-bold text-amber-600 uppercase">Nome</p>
                  <p className="font-bold text-lg">{pedido.cliente_nome}</p>
                </div>
                {pedido.cliente_nome_empresa && (
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase">Empresa</p>
                    <p className="font-medium italic">{pedido.cliente_nome_empresa}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase">Telefone</p>
                    <p>{pedido.cliente_telefone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase">Email</p>
                    <p className="break-all">{pedido.cliente_email}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs font-bold text-amber-600 uppercase">Endereço de Entrega</p>
                  <p className="text-sm">{pedido.cliente_endereco}</p>
                </div>
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="bg-amber-900 text-amber-50 p-6 rounded-xl shadow-lg flex flex-col justify-center">
              <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">Total a Pagar</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                R$ {Number(pedido.total).toFixed(2).replace('.', ',')}
              </h2>
              <div className="pt-4 border-t border-amber-800 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Quantidade de Itens:</span>
                  <span className="font-bold">{pedido.itens.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Forma de Pagamento:</span>
                  <span className="font-bold">A combinar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="mb-10">
            <h2 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Itens do Pedido
            </h2>
            
            {/* Mobile View: List */}
            <div className="md:hidden space-y-3">
              {pedido.itens.map((item, index) => (
                <div key={index} className="bg-white border border-amber-100 rounded-lg p-4 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-amber-500 font-mono">#{item.produto_codigo}</p>
                    <h3 className="font-bold text-amber-900">{item.produto_nome}</h3>
                    <p className="text-sm text-amber-700">{item.quantidade}x R$ {Number(item.preco_unitario).toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-amber-900">R$ {(item.quantidade * Number(item.preco_unitario)).toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-hidden rounded-xl border border-amber-100">
              <table className="min-w-full divide-y divide-amber-100">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-700 uppercase">Código</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-amber-700 uppercase">Produto</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-amber-700 uppercase">Qtd.</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-amber-700 uppercase">Preço Unit.</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-amber-700 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-50">
                  {pedido.itens.map((item, index) => (
                    <tr key={index} className="hover:bg-amber-50/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-amber-600">#{item.produto_codigo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-amber-900">{item.produto_nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700 text-center">{item.quantidade}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700 text-right">R$ {Number(item.preco_unitario).toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-amber-900 text-right">R$ {(item.quantidade * Number(item.preco_unitario)).toFixed(2).replace('.', ',')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Observações Adicionais</h3>
            <p className="text-gray-700 italic">{pedido.observacoes || 'Nenhuma observação informada.'}</p>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="bg-amber-50 p-6 md:p-8 flex flex-col sm:flex-row justify-end gap-3 no-print">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-amber-200 rounded-xl shadow-sm text-sm font-bold text-amber-700 bg-white hover:bg-amber-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-amber-700 border-2 border-amber-700 rounded-xl shadow-lg text-sm font-bold text-white hover:bg-amber-800 transition-transform active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir Comprovante
          </button>
        </div>
      </div>
      
      {/* Print Footer */}
      <div className="hidden print:block mt-8 text-center text-xs text-gray-400" suppressHydrationWarning>
        <p>Doces Sabor de Mel - Documento gerado em {new Date().toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  );
}
