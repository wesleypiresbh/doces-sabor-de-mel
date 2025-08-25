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
          router.push('/pedidos/lista'); // Redireciona se o pedido não for encontrado
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

  if (loading) {
    return <p className="text-center py-10">Carregando detalhes do pedido...</p>;
  }

  if (!pedido) {
    return <p className="text-center py-10">Pedido não encontrado.</p>;
  }

  return (
    <div className="container mx-auto p-4 printable-area">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-800">Detalhes do Pedido</h1>
            <p className="text-gray-500">Pedido #{pedido.numero_pedido}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Data do Pedido:</p>
            <p>{formatarData(pedido.data_pedido)}</p>
            <p className="font-semibold mt-2">Status:</p>
            <p className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {pedido.status}
            </p>
          </div>
        </div>

        {/* Informações do Cliente */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-amber-700 mb-4 border-b-2 border-amber-200 pb-2">Informações do Cliente</h2>
          <p><strong>Nome:</strong> {pedido.cliente_nome}</p>
          {pedido.cliente_nome_empresa && <p><strong>Empresa:</strong> {pedido.cliente_nome_empresa}</p>}
          <p><strong>Email:</strong> {pedido.cliente_email}</p>
          <p><strong>Telefone:</strong> {pedido.cliente_telefone}</p>
          <p><strong>Endereço:</strong> {pedido.cliente_endereco}</p>
        </div>

        {/* Itens do Pedido */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-amber-700 mb-4 border-b-2 border-amber-200 pb-2">Itens do Pedido</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd.</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Unit.</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedido.itens.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.produto_codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.produto_nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">R$ {Number(item.preco_unitario).toFixed(2).replace('.', ',')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">R$ {(item.quantidade * Number(item.preco_unitario)).toFixed(2).replace('.', ',')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total e Observações */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-amber-700">Observações:</h3>
            <p className="text-gray-600">{pedido.observacoes || 'Nenhuma observação.'}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-800">Total do Pedido: R$ {Number(pedido.total).toFixed(2).replace('.', ',')}</p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-10 flex justify-end space-x-4 no-print">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
          >
            Imprimir Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
