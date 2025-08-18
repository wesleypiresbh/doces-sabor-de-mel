'use client'

import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import ProdutoForm from '@/components/produtos/ProdutoForm'
import type { Produto } from '@/types'

interface EditProdutoPageProps {
  params: { id: string }
}

// Define a type for the form data state, allowing strings for number fields
type ProdutoFormData = Omit<Produto, 'id' | 'data_cadastro' | 'preco' | 'custo' | 'estoque' | 'estoque_minimo'> & {
  preco: string
  custo: string
  estoque: string
  estoque_minimo: string
}

export default function EditProdutoPage({ params }: EditProdutoPageProps) {
  const router = useRouter();
  const { id } = React.use(params); // Chama React.use() incondicionalmente

  if (!id) {
    // Agora verifica o 'id' já desempacotado
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        <p>Erro: Parâmetros da página não foram carregados corretamente.</p>
      </div>
    );
  }
  const [formData, setFormData] = useState<ProdutoFormData>({
    codigo: '',
    nome: '',
    descricao: '',
    preco: '',
    custo: '',
    estoque: '',
    estoque_minimo: '',
    unidade_medida: 'un',
    categoria: '',
    ativo: true,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(`/api/produtos/${id}`);
        if (!response.ok) {
          throw new Error('Produto não encontrado ou erro ao buscar.');
        }
        const produto = await response.json();

        if (produto) {
          // Populate form, converting numbers to strings for form inputs
          setFormData({
            codigo: produto.codigo,
            nome: produto.nome,
            descricao: produto.descricao || '',
            preco: String(produto.preco),
            custo: produto.custo !== null ? String(produto.custo) : '',
            estoque: String(produto.estoque),
            estoque_minimo: String(produto.estoque_minimo),
            unidade_medida: produto.unidade_medida,
            categoria: produto.categoria || '',
            ativo: produto.ativo,
          });
        } else {
          toast.error('Produto não encontrado.');
          router.push('/produtos');
        }
      } catch (error) {
        toast.error((error as Error).message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduto();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate and parse 'preco'
    const precoValue = parseFloat(formData.preco)
    if (isNaN(precoValue)) {
      toast.error('O campo Preço é obrigatório e deve ser um número.')
      return
    }

    // Validate and parse 'custo'
    let custoValue: number | null = null
    if (formData.custo) { // if it's not an empty string
        custoValue = parseFloat(formData.custo)
        if(isNaN(custoValue)) {
            toast.error('O Custo, se preenchido, deve ser um número válido.')
            return
        }
    }

    // Validate and parse 'estoque'
    const estoqueValue = parseInt(formData.estoque, 10)
    if (isNaN(estoqueValue)) {
        toast.error('O Estoque deve ser um número válido.')
        return
    }

    // Validate and parse 'estoque_minimo'
    const estoqueMinimoValue = parseInt(formData.estoque_minimo, 10)
    if (isNaN(estoqueMinimoValue)) {
        toast.error('O Estoque Mínimo deve ser um número válido.')
        return
    }

    try {
      // Create the payload with correct data types
      const payload: Partial<Omit<Produto, 'id' | 'data_cadastro'>> = {
        ...formData,
        preco: precoValue,
        custo: custoValue,
        estoque: estoqueValue,
        estoque_minimo: estoqueMinimoValue,
      };

      const response = await fetch(`/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar produto!');
      }

      toast.success('Produto atualizado com sucesso!');
      router.push('/produtos');
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center text-amber-800">
        <p>Carregando produto...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Editar Produto</h1>
      <div className="flex justify-end mb-4">
        <p className="text-lg font-semibold text-amber-800">Código: {formData.codigo}</p>
      </div>
      <ProdutoForm
        formData={formData}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSubmit={handleSubmit}
        routerBack={() => router.back()}
      />
    </div>
  )
}