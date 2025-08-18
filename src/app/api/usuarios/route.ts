import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';

export async function GET(request: Request) {
  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT id, email, nome FROM usuarios');
      return NextResponse.json(res.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ message: 'Erro ao carregar usuários' }, { status: 500 });
  }
}