'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import ProdutoForm from '@/components/produtos/ProdutoForm';
import type { Produto } from '@/types';

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState<Produto>({
    id: '',
    codigo: '',
    nome: '',
    descricao: null, // Changed to null as per type definition
    preco: 0,
    custo: null, // Changed to null as per type definition
    estoque: 0,
    estoque_minimo: 0,
    unidade_medida: 'un',
    categoria: null, // Changed to null as per type definition
    ativo: true,
    imagem_url: null, // Added as per type definition
    data_cadastro: '', // Added as per type definition
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProduto = async () => {
        try {
          const response = await fetch(`/api/produtos/${id}`);
          if (!response.ok) {
            throw new Error('Produto não encontrado');
          }
          const data = await response.json();
          setFormData(data); // Directly set data as types should now match
        } catch (error) {
          toast.error((error as Error).message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduto();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Handle numeric inputs
    if (['preco', 'custo', 'estoque', 'estoque_minimo'].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto');
      }

      toast.success('Produto atualizado com sucesso!');
      router.push('/produtos');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (loading) {
    return <p className="text-center">Carregando...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Editar Produto</h1>
      <ProdutoForm
        formData={formData}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSubmit={handleSubmit}
        routerBack={() => router.push('/produtos')}
      />
    </div>
  );
}
