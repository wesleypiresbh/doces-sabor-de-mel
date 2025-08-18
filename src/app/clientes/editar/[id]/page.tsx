'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'react-hot-toast'
import type { Cliente } from '@/types'

interface EditClientePageProps {
  params: {
    id: string
  }
}

export default function EditarClientePage({ params }: EditClientePageProps) {
  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [uf, setUf] = useState('')
  const [cep, setCep] = useState('')
  const [email, setEmail] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    const fetchCliente = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/clientes/${id}`)
        if (!response.ok) {
          setNotFound(true)
          throw new Error('Cliente não encontrado')
        }
        const data: Cliente = await response.json()
        setNomeEmpresa(data.nome_empresa || '')
        setNome(data.nome)
        setTelefone(data.telefone || '')
        setEndereco(data.endereco || '')
        setBairro(data.bairro || '')
        setCidade(data.cidade || '')
        setUf(data.uf || '')
        setCep(data.cep || '')
        setEmail(data.email || '')
        setAtivo(data.ativo)
      } catch (error) {
        toast.error((error as Error).message)
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCliente()
  }, [id])

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '')
    let masked = ''

    if (input.length > 0) {
      masked = `(${input.substring(0, 2)}`
    }
    if (input.length > 2) {
      masked += `) ${input.substring(2, 7)}`
    }
    if (input.length > 7) {
      masked += `-${input.substring(7, 11)}`
    }

    setTelefone(masked)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || !telefone) {
      toast.error('Nome de contato e telefone são obrigatórios.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome_empresa: nomeEmpresa,
          nome,
          telefone,
          endereco,
          bairro,
          cidade,
          uf,
          cep,
          email,
          ativo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao atualizar cliente.')
      }

      toast.success('Cliente atualizado com sucesso!')
      setTimeout(() => {
        router.push('/clientes')
      }, 1500)
    } catch (error) {
      toast.error((error as Error).message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (notFound) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-red-600">Cliente não encontrado</h1>
        <button onClick={() => router.push('/clientes')} className="mt-4 bg-amber-700 text-white px-6 py-2 rounded hover:bg-amber-800 transition-colors">
          Voltar para a lista de clientes
        </button>
      </div>
    )
  }

  if (isLoading && !nome) {
    return <p className="text-center">Carregando...</p>
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Editar Cliente</h1>

      <div className="bg-amber-50 p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nomeEmpresa" className="block text-sm font-medium mb-1 text-amber-800">Nome da Empresa</label>
            <input
              id="nomeEmpresa"
              type="text"
              className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-3/5">
              <label htmlFor="nome" className="block text-sm font-medium mb-1 text-amber-800">Contato</label>
              <input
                id="nome"
                type="text"
                className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="w-2/5">
              <label htmlFor="telefone" className="block text-sm font-medium mb-1 text-amber-800">Telefone</label>
              <input
                id="telefone"
                type="text"
                className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
                value={telefone}
                onChange={handleTelefoneChange}
                maxLength={15}
                placeholder="(XX) XXXXX-XXXX"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium mb-1 text-amber-800">Endereço</label>
            <input
              id="endereco"
              type="text"
              className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="bairro" className="block text-sm font-medium mb-1 text-amber-800">Bairro</label>
              <input
                id="bairro"
                type="text"
                className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="cidade" className="block text-sm font-medium mb-1 text-amber-800">Cidade</label>
              <input
                id="cidade"
                type="text"
                className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
            <div className="w-1/6">
              <label htmlFor="uf" className="block text-sm font-medium mb-1 text-amber-800">UF</label>
              <input
                id="uf"
                type="text"
                className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                maxLength={2}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2/5">
              <label htmlFor="cep" className="block text-sm font-medium mb-1 text-amber-800">CEP</label>
              <input
                id="cep"
                type="text"
                className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                maxLength={9}
              />
            </div>
            <div className="w-3/5">
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-amber-800">Email</label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border rounded border-amber-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 text-amber-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="ativo"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
            <label htmlFor="ativo" className="text-sm font-medium text-amber-800">Cliente Ativo</label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-amber-700 text-white px-6 py-2 rounded hover:bg-amber-800 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
