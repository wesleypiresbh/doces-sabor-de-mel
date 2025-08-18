'use client'

import { useState, useEffect, useCallback } from 'react'

import { toast } from 'react-hot-toast'

import type { Cliente } from '@/types'

import { useRouter } from 'next/navigation'

interface BuscaClienteProps {
  clienteSelecionado: Cliente | null
  onClienteSelecionado: (cliente: Cliente | null) => void
}

export default function BuscaCliente({ clienteSelecionado, onClienteSelecionado }: BuscaClienteProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [buscaCliente, setBuscaCliente] = useState('')
  const router = useRouter()

  const carregarClientes = useCallback(async () => {
    console.log("carregarClientes: Iniciando busca para", buscaCliente);
    try {
      const response = await fetch(`/api/clientes?busca=${buscaCliente}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
      }
      const data = await response.json();
      console.log("carregarClientes: Dados recebidos", data);
      setClientes(data);
      // Se a busca retornar apenas um cliente, seleciona-o automaticamente
      if (data.length === 1) {
        onClienteSelecionado(data[0]);
      }
    } catch (error) {
      console.error("carregarClientes: Erro na busca", error);
      toast.error((error as Error).message);
    }
  }, [buscaCliente, onClienteSelecionado]);

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarClientes()
    }, 500)

    return () => clearTimeout(timer)
  }, [buscaCliente, carregarClientes])

  return (
    <div className="bg-amber-50 rounded-lg shadow-md p-6 mb-3">
      <h2 className="text-xl font-semibold mb-4 text-amber-800">Informações do Cliente</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1 text-amber-800">Buscar Cliente por Nome</label>
          <input
            type="text"
            className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
            placeholder="Digite o nome do cliente ou empresa..."
            value={buscaCliente}
            onChange={(e) => setBuscaCliente(e.target.value)}
          />
        </div>

        <div>
          <button
            onClick={() => router.push('/clientes/novo')}
            className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors whitespace-nowrap"
          >
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Mostra os resultados da busca para seleção manual se houver mais de um resultado */}
      {clientes.length > 0 && !clienteSelecionado && (
        <div className="border-t border-amber-200 pt-4 mt-4">
          <h3 className="text-md font-semibold mb-2 text-amber-800">Resultados da Busca:</h3>
          <ul className="space-y-2">
            {clientes.map(cliente => (
              <li 
                key={cliente.id} 
                onClick={() => onClienteSelecionado(cliente)}
                className="cursor-pointer p-2 rounded hover:bg-amber-100 text-amber-700"
              >
                {cliente.nome} {cliente.nome_empresa ? `- ${cliente.nome_empresa}` : ''} - {cliente.telefone}
              </li>
            ))}
          </ul>
        </div>
      )}

      {clienteSelecionado && (
        <div className="bg-amber-100 p-4 rounded-lg mt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg text-amber-800">Cliente Selecionado:</p>
              <p className="text-amber-700"><strong>Nome:</strong> {clienteSelecionado.nome}</p>
              <p className="text-amber-700"><strong>Telefone:</strong> {clienteSelecionado.telefone}</p>
              {clienteSelecionado.nome_empresa && (
                <p className="text-amber-700"><strong>Empresa:</strong> {clienteSelecionado.nome_empresa}</p>
              )}
              <p className="text-amber-700"><strong>Endereço:</strong> {clienteSelecionado.endereco}</p>
              {clienteSelecionado.bairro && (
                <p className="text-amber-700"><strong>Bairro:</strong> {clienteSelecionado.bairro}</p>
              )}
            </div>
            <button 
              onClick={() => onClienteSelecionado(null)}
              className="text-sm text-red-500 hover:underline"
            >
              Limpar Seleção
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
