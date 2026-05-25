import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT MAX(CAST(codigo AS INTEGER)) as max_code FROM produtos');
      const maxCode = result.rows[0].max_code || 0;
      return NextResponse.json(maxCode);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao buscar o maior código de produto:', error);
    return NextResponse.json({ message: 'Erro ao buscar o maior código de produto.' }, { status: 500 });
  }
}
