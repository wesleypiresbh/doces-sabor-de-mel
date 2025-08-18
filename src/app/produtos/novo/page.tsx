'use client'

import { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import ProdutoForm from '@/components/produtos/ProdutoForm'

// É uma boa prática definir um tipo para o formData
interface ProdutoFormData {
  codigo: string;
  nome: string;
  descricao: string;
  preco: string; // Mantido como string para manipulação no input
  custo: string; // Mantido como string para manipulação no input
  estoque: string; // Mantido como string inicialmente
  estoque_minimo: string; // Mantido como string inicialmente
  unidade_medida: string;
  categoria: string;
  ativo: boolean;
}

export default function CadastroProdutoPage() {
  const router = useRouter()
  const [loadingCode, setLoadingCode] = useState(true);
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
    imagem_url: '',
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

    if (name === 'preco' || name === 'custo') {
      // Para preco e custo (type="text" com maxLength), permite apenas números, vírgula ou ponto
      // Remove caracteres que não são dígitos, vírgulas ou pontos
      const cleanedValue = value.replace(/[^\d,.]/g, '');
      // Opcional: Substituir vírgula por ponto para consistência antes de armazenar ou parsear
      // Isso é importante se o seu backend ou Supabase espera ponto como separador decimal
      // cleanedValue = cleanedValue.replace(/,/g, '.');

      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue,
      }));
    } else if (name === 'estoque' || name === 'estoque_minimo') {
      // Para estoque e estoque_minimo, permite apenas dígitos
      const cleanedValue = value.replace(/\D/g, ''); // Remove tudo que não for dígito
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }))
  }

  // A assinatura da função handleSubmit foi atualizada para receber o imageFile
  const handleSubmit = async (e: React.FormEvent, imageFile: File | null) => {
    e.preventDefault();

    try {
      // Prepara os dados do produto para envio
      const productDataToCreate = {
        ...formData,
        // Converte os valores para os tipos corretos antes de enviar
        preco: parseFloat(formData.preco.replace(',', '.')) || 0, // Garante que é um número
        custo: parseFloat(formData.custo.replace(',', '.')) || 0, // Garante que é um número
        estoque: parseInt(formData.estoque) || 0, // Garante que é um número inteiro
        estoque_minimo: parseInt(formData.estoque_minimo) || 0, // Garante que é um número inteiro
        imagem_url: '', // Imagem desativada por enquanto
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