import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const busca = searchParams.get('busca') || '';

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM clientes WHERE nome ILIKE $1 OR nome_empresa ILIKE $1 LIMIT 10',
        [`%${busca}%`]
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao buscar clientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { nomeEmpresa, nome, telefone, endereco, bairro, cidade, uf, cep, email, ativo } = await request.json();

  if (!nome || !telefone) {
    return NextResponse.json({ message: 'Nome de contato e telefone são obrigatórios.' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query(
      'INSERT INTO clientes (nome_empresa, nome, telefone, endereco, bairro, cidade, uf, cep, email, ativo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [nomeEmpresa, nome, telefone, endereco, bairro, cidade, uf, cep, email, ativo]
    );

    return NextResponse.json({ message: 'Cliente cadastrado com sucesso!' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    return NextResponse.json({ message: 'Erro ao cadastrar cliente.' }, { status: 500 });
  } finally {
    client.release();
  }
}
