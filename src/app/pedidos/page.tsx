'use client'

import { useState } from 'react'

import { toast, Toaster } from 'react-hot-toast'

import BuscaCliente from '@/components/pedidos/BuscaCliente'
import ItensPedido from '@/components/pedidos/ItensPedido'
import ResumoPedido from '@/components/pedidos/ResumoPedido'

import type { Cliente, ItemPedido } from '@/types'

export default function PedidosPage() {
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [itens, setItens] = useState<ItemPedido[]>([])
  const [observacoes, setObservacoes] = useState('')

  

  const limparFormulario = () => {
    setClienteSelecionado(null)
    setItens([])
    setObservacoes('')
  }

  const finalizarPedido = async () => {
    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cliente: clienteSelecionado, 
          itens, 
          observacoes 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar pedido');
      }

      toast.success('Pedido cadastrado com sucesso!');
      limparFormulario();
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Lançar Pedido</h1>
      
      <BuscaCliente 
        clienteSelecionado={clienteSelecionado} 
        onClienteSelecionado={setClienteSelecionado} 
      />
      
      <ItensPedido 
        itens={itens} 
        setItens={setItens} 
      />
      
      <ResumoPedido 
        itens={itens} 
        clienteSelecionado={clienteSelecionado}
        observacoes={observacoes}
        setObservacoes={setObservacoes}
        onFinalizar={finalizarPedido}
        onCancelar={limparFormulario}
      />
    </div>
  )
}