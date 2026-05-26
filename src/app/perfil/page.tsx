'use client';

import { useState, FormEvent } from 'react';
import { signOut } from 'next-auth/react';

export default function PerfilPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('A nova senha e a confirmação não correspondem.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/perfil/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Algo deu errado');
      }

      setMessage(data.message + ' Você será desconectado em breve...');
      
      setTimeout(() => {
        signOut({ callbackUrl: '/login' });
      }, 3000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-amber-800 uppercase tracking-widest">Meu Perfil</h1>
        <p className="text-amber-600">Gerencie sua conta e segurança</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-amber-100">
        <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Alterar Senha
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Senha Atual</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Nova Senha</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-black text-amber-800 uppercase tracking-widest mb-1">Confirmar Nova Senha</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-xl border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-amber-900"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2 animate-shake">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-amber-700 text-white rounded-xl font-black uppercase tracking-widest hover:bg-amber-800 transition-all shadow-lg shadow-amber-900/10 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : 'Salvar Nova Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
