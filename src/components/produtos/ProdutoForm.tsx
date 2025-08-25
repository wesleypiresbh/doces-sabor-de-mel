import React from 'react';

export interface ProdutoFormData {
  codigo: string;
  nome: string;
  descricao: string | null;
  preco: number;
  custo: number | null;
  estoque: number;
  estoque_minimo: number;
  unidade_medida: string;
  categoria: string | null;
  ativo: boolean;
  imagem_url?: string | null; // Optional as it might not be in the form
  data_cadastro?: string; // Optional as it might not be in the form
}

interface ProdutoFormProps {
  formData: ProdutoFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  routerBack: () => void;
}

export default function ProdutoForm({
  formData,
  handleChange,
  handleCheckboxChange,
  handleSubmit,
  routerBack,
}: ProdutoFormProps) {
  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna de Informações do Produto */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={formData.nome}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            name="descricao"
            id="descricao"
            value={formData.descricao || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
          <input
            type="text"
            name="preco"
            id="preco"
            value={formData.preco || 0}
            onChange={handleChange}
            maxLength={10}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="custo" className="block text-sm font-medium text-gray-700">Custo (R$)</label>
          <input
            type="text"
            name="custo"
            id="custo"
            value={formData.custo || 0}
            onChange={handleChange}
            maxLength={10}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="estoque" className="block text-sm font-medium text-gray-700">Estoque</label>
          <input
            type="text"
            name="estoque"
            id="estoque"
            value={formData.estoque || 0}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="estoque_minimo" className="block text-sm font-medium text-gray-700">Estoque Mínimo</label>
          <input
            type="text"
            name="estoque_minimo"
            id="estoque_minimo"
            value={formData.estoque_minimo || 0}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="unidade_medida" className="block text-sm font-medium text-gray-700">Unidade de Medida</label>
          <select
            name="unidade_medida"
            id="unidade_medida"
            value={formData.unidade_medida}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          >
            <option value="un">Unidade</option>
            <option value="kg">Quilograma</option>
            <option value="g">Grama</option>
            <option value="l">Litro</option>
            <option value="ml">Mililitro</option>
          </select>
        </div>
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoria</label>
          <input
            type="text"
            name="categoria"
            id="categoria"
            value={formData.categoria || ''}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          />
        </div>
        <div className="md:col-span-2 flex items-center">
          <input
            type="checkbox"
            name="ativo"
            id="ativo"
            checked={formData.ativo}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">Produto Ativo</label>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={routerBack}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          Salvar Produto
        </button>
      </div>
    </form>
  );
}