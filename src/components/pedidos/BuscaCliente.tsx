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
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const carregarClientes = useCallback(async () => {
    if (!buscaCliente.trim()) {
      setClientes([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/clientes?busca=${buscaCliente}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
      }
      const data = await response.json();
      setClientes(data);
      
      // Se a busca retornar apenas um cliente exato, poderíamos selecionar, 
      // mas é melhor deixar o usuário escolher para evitar confusão.
    } catch (error) {
      console.error("carregarClientes: Erro na busca", error);
      toast.error((error as Error).message);
    } finally {
      setIsSearching(false);
    }
  }, [buscaCliente]);

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarClientes()
    }, 500)

    return () => clearTimeout(timer)
  }, [buscaCliente, carregarClientes])

  return (
    <div className="bg-amber-50 rounded-lg shadow-md p-4 md:p-6 mb-3">
      <h2 className="text-xl font-semibold mb-4 text-amber-800">Informações do Cliente</h2>

      {!clienteSelecionado ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-500">
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </span>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-white transition-all text-amber-900"
                placeholder="Nome do cliente ou empresa..."
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
              />
            </div>
            <button
              onClick={() => router.push('/clientes/novo')}
              className="bg-amber-100 text-amber-800 border border-amber-300 px-4 py-2.5 rounded-lg hover:bg-amber-200 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Novo Cliente
            </button>
          </div>

          {/* Results List */}
          {clientes.length > 0 && (
            <div className="bg-white border border-amber-200 rounded-lg overflow-hidden shadow-sm divide-y divide-amber-50">
              <div className="bg-amber-50/50 px-4 py-2 text-xs font-bold text-amber-600 uppercase">
                Selecione o Cliente
              </div>
              {clientes.map(cliente => (
                <button 
                  key={cliente.id} 
                  onClick={() => onClienteSelecionado(cliente)}
                  className="w-full text-left p-3 hover:bg-amber-50 transition-colors flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
                >
                  <div>
                    <span className="font-bold text-amber-900 block">{cliente.nome}</span>
                    {cliente.nome_empresa && (
                      <span className="text-xs text-amber-600 italic">{cliente.nome_empresa}</span>
                    )}
                  </div>
                  <span className="text-sm text-amber-700 font-medium">{cliente.telefone}</span>
                </button>
              ))}
            </div>
          )}
          
          {buscaCliente && !isSearching && clientes.length === 0 && (
            <p className="text-center text-amber-600 italic py-2">Nenhum cliente encontrado para "{buscaCliente}"</p>
          )}
        </div>
      ) : (
        <div className="bg-white border-2 border-amber-200 p-4 rounded-xl shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <button 
              onClick={() => onClienteSelecionado(null)}
              className="p-2 text-amber-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
              title="Trocar cliente"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-full text-amber-700 hidden sm:block">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-amber-900 leading-tight">{clienteSelecionado.nome}</h3>
              {clienteSelecionado.nome_empresa && (
                <p className="text-amber-600 font-medium italic text-sm">{clienteSelecionado.nome_empresa}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-2">
                <p className="text-sm text-amber-800 flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {clienteSelecionado.telefone}
                </p>
                <p className="text-sm text-amber-800 flex items-start gap-1">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    {clienteSelecionado.endereco}
                    {clienteSelecionado.bairro && <span className="block text-xs font-normal opacity-80">{clienteSelecionado.bairro}</span>}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
