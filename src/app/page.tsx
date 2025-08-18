import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/pedidos'); // Redireciona para a página de pedidos se estiver logado
  } else {
    redirect('/login'); // Redireciona para a página de login se não estiver logado
  }

  return null; // Não renderiza nada, apenas redireciona
}