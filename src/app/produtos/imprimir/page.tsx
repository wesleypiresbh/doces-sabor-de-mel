'use client';

import { useEffect, useState } from 'react';

interface Produto {
  id: string;
  codigo: string;
  nome: string;
  estoque: number;
  preco: number;
}

export default function ImprimirProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    fetch('/api/produtos')
      .then((res) => res.json())
      .then(setProdutos);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 no-print"
      >
        Imprimir
      </button>
      <div className="printable-area">
        <h1 className="text-2xl font-bold mb-4">Lista de Produtos</h1>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Código</th>
              <th className="py-2 px-4 border-b">Nome</th>
              <th className="py-2 px-4 border-b">Quantidade</th>
              <th className="py-2 px-4 border-b">Preço</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td className="py-2 px-4 border-b text-center">{produto.codigo}</td>
                <td className="py-2 px-4 border-b">{produto.nome}</td>
                <td className="py-2 px-4 border-b text-center">{produto.estoque}</td>
                <td className="py-2 px-4 border-b text-right">R$ {produto.preco.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
