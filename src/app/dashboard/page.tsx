'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!session || session.user?.role !== 'Admin') {
      router.push('/') // Redirect non-admins to the homepage
    }
  }, [session, status, router])

  if (status === 'loading' || !session || session.user?.role !== 'Admin') {
    return <p>Carregando ou acesso negado...</p> // Or a loading spinner
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Dashboard do Administrador</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Placeholder for dashboard widgets */}
        <div className="bg-amber-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Vendas Recentes</h2>
          <p className="text-amber-700">Aqui irão os dados de vendas recentes.</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Estatísticas de Pedidos</h2>
          <p className="text-amber-700">Aqui irão as estatísticas de pedidos.</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Produtos Populares</h2>
          <p className="text-amber-700">Aqui irão os produtos mais populares.</p>
        </div>
      </div>
    </div>
  )
}
