export type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  endereco: string | null;
  nome_empresa: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  cep: string | null;
  email: string | null;
  ativo: boolean;
};

export type Produto = {
  id: string;
  codigo: string;
  nome: string;
  descricao: string | null;
  preco: number;
  custo: number | null;
  estoque: number;
  estoque_minimo: number;
  unidade_medida: string;
  categoria: string | null;
  imagem_url: string | null;
  ativo: boolean;
  data_cadastro: string;
};

export type ItemPedido = {
  id?: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  total: number;
  produto?: Produto; // Opcional, para exibição no frontend
};
