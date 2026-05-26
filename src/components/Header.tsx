'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    const data = await signOut({ 
      redirect: false, 
      callbackUrl: '/login' 
    });
    // Força um redirecionamento completo para limpar o estado
    window.location.href = data.url;
  };

  return (
    <header className="bg-amber-800 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <Link href="/" className="text-xl md:text-2xl font-bold hover:text-amber-200 transition-colors" onClick={closeMenu}>
              Doces Sabor de Mel
            </Link>
            {session && (
              <p className="text-xs text-amber-100 hidden sm:block">Olá, {session.user?.name}</p>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button 
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 items-center">
            {session ? (
              <>
                <li>
                  <Link href="/pedidos" className="hover:text-amber-200 transition-colors">
                    Home
                  </Link>
                </li>
                <li className="relative group">
                  <button className="flex items-center hover:text-amber-200 transition-colors">
                    Clientes
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <ul className="absolute hidden group-hover:block bg-amber-700 text-white mt-1 rounded-md shadow-xl z-20 min-w-[160px] overflow-hidden">
                    <li>
                      <Link href="/clientes" className="block px-4 py-2 hover:bg-amber-600 transition-colors">
                        Lista de Clientes
                      </Link>
                    </li>
                    <li>
                      <Link href="/clientes/imprimir" className="block px-4 py-2 hover:bg-amber-600 transition-colors">
                        Imprimir Lista
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="relative group">
                  <button className="flex items-center hover:text-amber-200 transition-colors">
                    Pedidos
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <ul className="absolute hidden group-hover:block bg-amber-700 text-white mt-1 rounded-md shadow-xl z-20 min-w-[160px] overflow-hidden">
                    <li>
                      <Link href="/pedidos" className="block px-4 py-2 hover:bg-amber-600 transition-colors">
                        Lançar Pedido
                      </Link>
                    </li>
                    <li>
                      <Link href="/pedidos/lista" className="block px-4 py-2 hover:bg-amber-600 transition-colors">
                        Lista de Pedidos
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="relative group">
                  <button className="flex items-center hover:text-amber-200 transition-colors">
                    Produtos
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <ul className="absolute hidden group-hover:block bg-amber-700 text-white mt-1 rounded-md shadow-xl z-20 min-w-[160px] overflow-hidden">
                    <li>
                      <Link href="/produtos" className="block px-4 py-2 hover:bg-amber-600 transition-colors">
                        Lista de Produtos
                      </Link>
                    </li>
                    <li>
                      <Link href="/produtos/imprimir" className="block px-4 py-2 hover:bg-amber-600 transition-colors">
                        Imprimir Lista
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link href="/usuarios" className="hover:text-amber-200 transition-colors">
                    Usuários
                  </Link>
                </li>
                <li>
                  <Link href="/perfil" className="hover:text-amber-200 transition-colors">
                    Perfil
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-md transition-colors font-medium border border-amber-600 shadow-sm"
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-md transition-colors font-medium border border-amber-600 shadow-sm">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 pb-4 transition-all duration-300 ease-in-out border-t border-amber-700 pt-4`}>
          {session && (
            <p className="text-sm text-amber-200 mb-4 px-2 italic">Olá, {session.user?.name}</p>
          )}
          <ul className="flex flex-col space-y-1">
            {session ? (
              <>
                <li>
                  <Link href="/pedidos" className="block px-2 py-3 hover:bg-amber-700 rounded-md transition-colors" onClick={closeMenu}>
                    Home (Lançar Pedido)
                  </Link>
                </li>
                
                {/* Mobile Dropdown: Clientes */}
                <li>
                  <button 
                    className="w-full flex justify-between items-center px-2 py-3 hover:bg-amber-700 rounded-md transition-colors"
                    onClick={() => toggleDropdown('clientes')}
                  >
                    <span>Clientes</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'clientes' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <ul className={`${activeDropdown === 'clientes' ? 'block' : 'hidden'} bg-amber-900/30 ml-4 mt-1 rounded-md overflow-hidden`}>
                    <li>
                      <Link href="/clientes" className="block px-4 py-2 hover:bg-amber-700 transition-colors" onClick={closeMenu}>
                        Lista de Clientes
                      </Link>
                    </li>
                    <li>
                      <Link href="/clientes/imprimir" className="block px-4 py-2 hover:bg-amber-700 transition-colors" onClick={closeMenu}>
                        Imprimir Lista
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Mobile Dropdown: Pedidos */}
                <li>
                  <button 
                    className="w-full flex justify-between items-center px-2 py-3 hover:bg-amber-700 rounded-md transition-colors"
                    onClick={() => toggleDropdown('pedidos')}
                  >
                    <span>Pedidos</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'pedidos' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <ul className={`${activeDropdown === 'pedidos' ? 'block' : 'hidden'} bg-amber-900/30 ml-4 mt-1 rounded-md overflow-hidden`}>
                    <li>
                      <Link href="/pedidos" className="block px-4 py-2 hover:bg-amber-700 transition-colors" onClick={closeMenu}>
                        Lançar Pedido
                      </Link>
                    </li>
                    <li>
                      <Link href="/pedidos/lista" className="block px-4 py-2 hover:bg-amber-700 transition-colors" onClick={closeMenu}>
                        Lista de Pedidos
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Mobile Dropdown: Produtos */}
                <li>
                  <button 
                    className="w-full flex justify-between items-center px-2 py-3 hover:bg-amber-700 rounded-md transition-colors"
                    onClick={() => toggleDropdown('produtos')}
                  >
                    <span>Produtos</span>
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'produtos' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <ul className={`${activeDropdown === 'produtos' ? 'block' : 'hidden'} bg-amber-900/30 ml-4 mt-1 rounded-md overflow-hidden`}>
                    <li>
                      <Link href="/produtos" className="block px-4 py-2 hover:bg-amber-700 transition-colors" onClick={closeMenu}>
                        Lista de Produtos
                      </Link>
                    </li>
                    <li>
                      <Link href="/produtos/imprimir" className="block px-4 py-2 hover:bg-amber-700 transition-colors" onClick={closeMenu}>
                        Imprimir Lista
                      </Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link href="/usuarios" className="block px-2 py-3 hover:bg-amber-700 rounded-md transition-colors" onClick={closeMenu}>
                    Usuários
                  </Link>
                </li>
                <li>
                  <Link href="/perfil" className="block px-2 py-3 hover:bg-amber-700 rounded-md transition-colors" onClick={closeMenu}>
                    Perfil
                  </Link>
                </li>
                <li className="pt-2">
                  <button 
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }} 
                    className="w-full text-left px-2 py-3 text-amber-200 hover:bg-amber-700 rounded-md transition-colors font-bold"
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="block px-2 py-3 bg-amber-700 hover:bg-amber-600 rounded-md transition-colors text-center font-bold" onClick={closeMenu}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
