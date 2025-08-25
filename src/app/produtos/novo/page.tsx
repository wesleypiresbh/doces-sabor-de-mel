'use client'

import { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import ProdutoForm, { ProdutoFormData } from '@/components/produtos/ProdutoForm'



export default function CadastroProdutoPage() {
  const router = useRouter()
  const [loadingCode, setLoadingCode] = useState(true);
  const [formData, setFormData] = useState<ProdutoFormData>({
    codigo: '',
    nome: '',
    descricao: null,
    preco: 0,
    custo: null,
    estoque: 0,
    estoque_minimo: 0,
    unidade_medida: 'un',
    categoria: null,
    imagem_url: null,
    ativo: true,
  })

  useEffect(() => {
    const loadNextCode = async () => {
      setLoadingCode(true);
      try {
        const response = await fetch('/api/produtos/max-code');
        if (!response.ok) {
          throw new Error('Erro ao carregar código do produto');
        }
        const maxCode = await response.json();
        const nextCode = Math.max(maxCode, 999) + 1;
        setFormData(prev => ({ ...prev, codigo: nextCode.toString() }));
      } catch (error) {
        toast.error(`Erro ao carregar código do produto: ${(error as Error).message}`);
        console.error('Erro ao carregar código do produto:', error);
        setFormData(prev => ({ ...prev, codigo: 'ERRO' }));
      } finally {
        setLoadingCode(false);
      }
    };
    loadNextCode();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (['preco', 'custo', 'estoque', 'estoque_minimo'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value.replace(',', '.')) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }))
  }

  // A assinatura da função handleSubmit foi atualizada para receber o imageFile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepara os dados do produto para envio
      const productDataToCreate = {
        ...formData,
        // Os valores já estão nos tipos corretos devido ao handleChange
        imagem_url: null, // Imagem desativada por enquanto, definido como null
      };

      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productDataToCreate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar produto.');
      }

      toast.success('Produto cadastrado com sucesso!');
      router.push('/produtos'); // Redireciona para a lista de produtos
    } catch (error) {
      toast.error(`Erro ao cadastrar produto: ${(error as Error).message}`);
      console.error('Erro no handleSubmit:', error);
    }
  };;

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">Cadastro de Produto</h1>
      <div className="flex justify-end mb-4">
        <p className="text-lg font-semibold text-amber-800">Código: {loadingCode ? 'Carregando...' : formData.codigo}</p>
      </div>
      <ProdutoForm
        formData={formData}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSubmit={handleSubmit} // A função handleSubmit agora é passada corretamente
        routerBack={() => router.back()}
      />
    </div>
  )
}