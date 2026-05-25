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
  imagem_url?: string | null;
  data_cadastro?: string;
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
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-amber-100 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="md:col-span-2">
          <label htmlFor="nome" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Nome do Produto *</label>
          <input
            type="text"
            name="nome"
            id="nome"
            placeholder="Ex: Doce de Leite Caseiro"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="descricao" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Descrição</label>
          <textarea
            name="descricao"
            id="descricao"
            placeholder="Detalhes sobre o produto..."
            value={formData.descricao || ''}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
          ></textarea>
        </div>

        {/* Pricing */}
        <div>
          <label htmlFor="preco" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Preço de Venda (R$) *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold">R$</span>
            <input
              type="number"
              name="preco"
              id="preco"
              value={formData.preco || 0}
              onChange={handleChange}
              step="0.01"
              className="w-full pl-10 pr-4 py-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900 font-bold bg-amber-50/30"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="custo" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Custo (R$)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold opacity-60">R$</span>
            <input
              type="number"
              name="custo"
              id="custo"
              value={formData.custo || 0}
              onChange={handleChange}
              step="0.01"
              className="w-full pl-10 pr-4 py-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900 opacity-80"
            />
          </div>
        </div>

        {/* Inventory */}
        <div className="grid grid-cols-2 gap-4 md:col-span-2">
          <div>
            <label htmlFor="estoque" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Estoque Atual *</label>
            <input
              type="number"
              name="estoque"
              id="estoque"
              value={formData.estoque || 0}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
              required
            />
          </div>
          <div>
            <label htmlFor="estoque_minimo" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Estoque Mínimo</label>
            <input
              type="number"
              name="estoque_minimo"
              id="estoque_minimo"
              value={formData.estoque_minimo || 0}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
            />
          </div>
        </div>

        {/* Metadata */}
        <div>
          <label htmlFor="unidade_medida" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Unidade de Medida</label>
          <select
            name="unidade_medida"
            id="unidade_medida"
            value={formData.unidade_medida}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900 bg-white"
          >
            <option value="un">Unidade (un)</option>
            <option value="kg">Quilograma (kg)</option>
            <option value="g">Grama (g)</option>
            <option value="l">Litro (l)</option>
            <option value="ml">Mililitro (ml)</option>
            <option value="cx">Caixa (cx)</option>
            <option value="pct">Pacote (pct)</option>
          </select>
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Categoria</label>
          <input
            type="text"
            name="categoria"
            id="categoria"
            placeholder="Ex: Bolos, Doces, Geleias"
            value={formData.categoria || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
          />
        </div>

        <div className="md:col-span-2 pt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="ativo"
                id="ativo"
                className="sr-only"
                checked={formData.ativo}
                onChange={handleCheckboxChange}
              />
              <div className={`w-12 h-6 rounded-full transition-colors ${formData.ativo ? 'bg-amber-600' : 'bg-gray-300'}`}></div>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.ativo ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-sm font-bold text-amber-800 uppercase tracking-widest">Produto Ativo para Vendas</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-amber-50">
        <button
          type="button"
          onClick={routerBack}
          className="px-8 py-3 rounded-xl border-2 border-amber-100 text-sm font-bold text-amber-700 hover:bg-amber-50 transition-colors order-2 sm:order-1"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-amber-700 text-sm font-bold text-white hover:bg-amber-800 transition-transform active:scale-95 shadow-lg shadow-amber-900/10 order-1 sm:order-2"
        >
          Salvar Produto
        </button>
      </div>
    </form>
  );
}