import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { nome, email, password, role = 'User' } = await request.json(); // Adiciona role com valor padrão 'User'

  if (!nome || !email || !password) {
    return NextResponse.json({ message: 'Nome, email e senha são obrigatórios' }, { status: 400 });
  }

  // Validação simples para o role
  if (!['User', 'Admin'].includes(role)) {
    return NextResponse.json({ message: 'Perfil inválido' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    // Verificar se o usuário já existe
    const existingUser = await client.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: 'Email já cadastrado' }, { status: 409 }); // 409 Conflict
    }

    // Criptografar a senha
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Inserir novo usuário com o perfil
    await client.query(
      'INSERT INTO usuarios (nome, email, hashed_password, role) VALUES ($1, $2, $3, $4)',
      [nome, email, hashedPassword, role]
    );

    return NextResponse.json({ message: 'Usuário criado com sucesso' }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ message: 'Erro ao criar usuário' }, { status: 500 });
  } finally {
    client.release();
  }
}
