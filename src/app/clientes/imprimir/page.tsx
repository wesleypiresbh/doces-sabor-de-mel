'use client';

import { useEffect, useState } from 'react';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  cidade: string;
}

export default function ImprimirClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    fetch('/api/clientes')
      .then((res) => res.json())
      .then(setClientes);
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
        <h1 className="text-2xl font-bold mb-4">Lista de Clientes</h1>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nome</th>
              <th className="py-2 px-4 border-b">Telefone</th>
              <th className="py-2 px-4 border-b">Cidade</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="py-2 px-4 border-b">{cliente.nome}</td>
                <td className="py-2 px-4 border-b">{cliente.telefone}</td>
                <td className="py-2 px-4 border-b">{cliente.cidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
