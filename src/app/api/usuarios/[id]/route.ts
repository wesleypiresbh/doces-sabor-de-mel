import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/neon/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET: Buscar um usuário específico
export async function GET(request: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { id } = context.params;

  if (session?.user?.role !== 'Admin') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, nome, email, role FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    client.release();
  }
}

// PUT: Atualizar um usuário
export async function PUT(request: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const { id } = context.params;

  if (session?.user?.role !== 'Admin') {
    return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
  }

  const { nome, email, role } = await request.json();

  if (!nome || !email || !role) {
    return NextResponse.json({ message: 'Nome, email e perfil são obrigatórios.' }, { status: 400 });
  }

  // Impedir que um admin mude seu próprio perfil para não-admin
  if (session.user.id === id && session.user.role === 'Admin' && role !== 'Admin') {
    return NextResponse.json({ message: 'Não é permitido remover o próprio status de Administrador.' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      'UPDATE usuarios SET nome = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, nome, email, role',
      [nome, email, role, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Usuário não encontrado para atualização.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuário atualizado com sucesso!', user: result.rows[0] }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    // Tratar erro de email duplicado
    if (error.code === '23505') { // unique_violation
        return NextResponse.json({ message: 'O email informado já está em uso por outro usuário.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    client.release();
  }
}


export async function DELETE(request: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  const idToDelete = context.params.id;

  // 1. Verificar se o usuário é um admin
  if (session?.user?.role !== 'Admin') {
    return NextResponse.json({ message: 'Acesso negado. Somente administradores podem excluir usuários.' }, { status: 403 });
  }

  // 2. Impedir que o admin se auto-delete
  if (session.user.id === idToDelete) {
    return NextResponse.json({ message: 'Administradores não podem excluir a si mesmos.' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // 3. Excluir o usuário do banco de dados
    const result = await client.query('DELETE FROM usuarios WHERE id = $1', [idToDelete]);

    // Verificar se algum usuário foi realmente deletado
    if (result.rowCount === 0) {
        return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuário excluído com sucesso' }, { status: 200 });

  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    client.release();
  }
}
