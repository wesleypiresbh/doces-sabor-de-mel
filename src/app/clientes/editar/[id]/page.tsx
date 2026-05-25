'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'react-hot-toast'
import type { Cliente } from '@/types'

export default function EditarClientePage({ params }: { params: { id: string } }) {
  const { id } = params
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
  const [isFetching, setIsFetching] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (id) {
      const fetchCliente = async () => {
        setIsFetching(true)
        try {
          const response = await fetch(`/api/clientes/${id}`)
          if (!response.ok) {
            throw new Error('Cliente não encontrado')
          }
          const data: Cliente = await response.json()
          setNomeEmpresa(data.nome_empresa || '')
          setNome(data.nome)
          setTelefone(data.telefone)
          setEndereco(data.endereco || '')
          setBairro(data.bairro || '')
          setCidade(data.cidade || '')
          setUf(data.uf || '')
          setCep(data.cep || '')
          setEmail(data.email || '')
          setAtivo(data.ativo)
        } catch (error) {
          toast.error((error as Error).message)
          router.push('/clientes')
        } finally {
          setIsFetching(false)
        }
      }
      fetchCliente()
    }
  }, [id, router])

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    let masked = '';

    if (input.length > 0) {
      masked = `(${input.substring(0, 2)}`;
    }
    if (input.length > 2) {
      masked += `) ${input.substring(2, 7)}`;
    }
    if (input.length > 7) {
      masked += `-${input.substring(7, 11)}`;
    }

    setTelefone(masked);
  };

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

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Toaster position="top-right" />
      
      <div className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-amber-100 rounded-full text-amber-800 transition-colors"
          title="Voltar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-amber-800">Editar Cliente</h1>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-amber-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="nomeEmpresa" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Nome da Empresa</label>
              <input
                id="nomeEmpresa"
                type="text"
                placeholder="Ex: Doceria Silva LTDA"
                className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900 bg-amber-50/30"
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="nome" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Contato *</label>
              <input
                id="nome"
                type="text"
                placeholder="Nome da pessoa"
                className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Telefone *</label>
              <input
                id="telefone"
                type="text"
                className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
                value={telefone}
                onChange={handleTelefoneChange}
                maxLength={15}
                placeholder="(XX) XXXXX-XXXX"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Email</label>
              <input
                id="email"
                type="email"
                placeholder="cliente@email.com"
                className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="endereco" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Endereço</label>
              <input
                id="endereco"
                type="text"
                placeholder="Rua, número, complemento"
                className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label htmlFor="bairro" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Bairro</label>
                <input
                  id="bairro"
                  type="text"
                  className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="cidade" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Cidade</label>
                <input
                  id="cidade"
                  type="text"
                  className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="uf" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">UF</label>
                <input
                  id="uf"
                  type="text"
                  className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  maxLength={2}
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <label htmlFor="cep" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">CEP</label>
              <input
                id="cep"
                type="text"
                placeholder="00000-000"
                className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                maxLength={9}
              />
            </div>

            <div className="md:col-span-1 flex items-end pb-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    id="ativo"
                    type="checkbox"
                    className="sr-only"
                    checked={ativo}
                    onChange={(e) => setAtivo(e.target.checked)}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${ativo ? 'bg-amber-600' : 'bg-gray-300'}`}></div>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${ativo ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm font-bold text-amber-800 uppercase tracking-widest">Cliente Ativo</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-amber-50">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 rounded-xl border-2 border-amber-100 text-sm font-bold text-amber-700 hover:bg-amber-50 transition-colors order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-amber-700 text-sm font-bold text-white hover:bg-amber-800 transition-transform active:scale-95 shadow-lg shadow-amber-900/10 order-1 sm:order-2 disabled:opacity-50"
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
