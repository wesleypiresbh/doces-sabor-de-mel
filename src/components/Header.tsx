'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-amber-800 p-4 text-white">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Doces Sabor de Mel
        </Link>
        <ul className="flex space-x-4">
          {session ? (
            <>
              <li>
                <Link href="/pedidos" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/clientes" className="hover:underline">
                  Clientes
                </Link>
              </li>
              <li className="relative group">
                <span className="hover:underline cursor-pointer">Pedidos</span>
                <ul className="absolute hidden group-hover:block bg-amber-700 text-white pt-2 rounded shadow-lg z-10">
                  <li>
                    <Link href="/pedidos" className="block px-4 py-2 hover:bg-amber-600 whitespace-nowrap">
                      Lançar Pedido
                    </Link>
                  </li>
                  <li>
                    <Link href="/pedidos/lista" className="block px-4 py-2 hover:bg-amber-600 whitespace-nowrap">
                      Lista de Pedidos
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/produtos" className="hover:underline">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/usuarios" className="hover:underline">
                  Usuários
                </Link>
              </li>
              <li>
                <button onClick={() => signOut()} className="hover:underline bg-transparent border-none text-white cursor-pointer">
                  Sair
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
