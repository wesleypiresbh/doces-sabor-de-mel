import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: 'A senha atual e a nova senha são obrigatórias' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const userId = session.user.id;
    
    // Buscar o usuário no banco de dados
    const userResult = await client.query('SELECT * FROM usuarios WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Verificar a senha atual
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.hashed_password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Senha atual incorreta' }, { status: 401 });
    }

    // Criptografar a nova senha
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    // Atualizar a senha no banco de dados
    await client.query(
      'UPDATE usuarios SET hashed_password = $1 WHERE id = $2',
      [hashedNewPassword, userId]
    );

    return NextResponse.json({ message: 'Senha alterada com sucesso' }, { status: 200 });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    client.release();
  }
}
