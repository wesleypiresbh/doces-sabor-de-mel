'use client'

import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ItemPedidoDetalhe {
  quantidade: number;
  preco_unitario: number;
  total: number;
  produto_nome: string;
  produto_codigo: string;
  produto_unidade_medida: string;
}

interface PedidoDetalhe {
  id: string;
  numero_pedido: number;
  data_pedido: string;
  cliente_nome: string;
  cliente_nome_empresa: string | null;
  cliente_telefone: string | null;
  cliente_endereco: string | null;
  status: string;
  total: number;
  observacoes: string | null;
  itens: ItemPedidoDetalhe[];
}

interface PedidoDetalhesPageProps {
  params: { id: string };
}

export default function PedidoDetalhesPage({ params }: PedidoDetalhesPageProps) {
  const router = useRouter();
  const { id } = React.use(params); // ID do pedido

  const [pedido, setPedido] = useState<PedidoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await fetch(`/api/pedidos/${id}`);
        if (!response.ok) {
          throw new Error('Pedido não encontrado ou erro ao buscar.');
        }
        const data = await response.json();
        setPedido(data);
      } catch (error) {
        toast.error((error as Error).message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [id]);

  const formatarData = (dataString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center text-amber-800">
        <p>Carregando detalhes do pedido...</p>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        <p>Pedido não encontrado.</p>
        <Link href="/pedidos/lista" className="text-blue-600 hover:underline">Voltar para a lista de pedidos</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Detalhes do Pedido #{pedido.numero_pedido}</h1>

      <div className="bg-amber-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-amber-800 mb-4">Informações do Pedido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-700">
          <p><strong>Número:</strong> {pedido.numero_pedido}</p>
          <p><strong>Data:</strong> {formatarData(pedido.data_pedido)}</p>
          <p><strong>Status:</strong> {pedido.status}</p>
          <p><strong>Total:</strong> R$ {(Number(pedido.total) || 0).toFixed(2).replace('.', ',')}</p>
          <p className="md:col-span-2"><strong>Observações:</strong> {pedido.observacoes || 'Nenhuma'}</p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-amber-800 mb-4">Informações do Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-700">
          <p><strong>Nome:</strong> {pedido.cliente_nome}</p>
          <p><strong>Empresa:</strong> {pedido.cliente_nome_empresa || 'N/A'}</p>
          <p><strong>Telefone:</strong> {pedido.cliente_telefone || 'N/A'}</p>
          <p><strong>Endereço:</strong> {pedido.cliente_endereco || 'N/A'}</p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-amber-800 mb-4">Itens do Pedido</h2>
        {pedido.itens.length === 0 ? (
          <p className="text-center text-amber-700">Nenhum item neste pedido.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-200">
              <thead className="bg-amber-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Unidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Qtd.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Preço Unit.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-200">
                {pedido.itens.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">{item.produto_nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{item.produto_codigo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{item.produto_unidade_medida}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">{item.quantidade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">R$ {(Number(item.preco_unitario) || 0).toFixed(2).replace('.', ',')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">R$ {(Number(item.total) || 0).toFixed(2).replace('.', ',')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => window.print()} // Botão de imprimir
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Imprimir Pedido
        </button>
        <Link
          href="/pedidos/lista"
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors flex items-center justify-center"
        >
          Voltar para a Lista
        </Link>
      </div>
    </div>
  );
}
