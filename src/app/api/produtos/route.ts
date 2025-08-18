import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const busca = searchParams.get('busca') || '';

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, codigo, nome, descricao, preco, custo, estoque, estoque_minimo, unidade_medida, categoria, ativo FROM produtos WHERE nome ILIKE $1 LIMIT 10',
        [`%${busca}%`]
      );
      // Converte preco e custo para número
      const produtos = result.rows.map(row => ({
        ...row,
        preco: parseFloat(row.preco),
        custo: row.custo ? parseFloat(row.custo) : null,
      }));
      return NextResponse.json(produtos);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    // Em um ambiente de produção, evite enviar o erro detalhado para o cliente
    return NextResponse.json({ message: 'Erro ao buscar produtos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { codigo, nome, descricao, preco, custo, estoque, estoque_minimo, unidade_medida, categoria, ativo } = await request.json();

  if (!nome || !preco || !codigo) {
    return NextResponse.json({ message: 'Nome, preço e código são obrigatórios.' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query(
      'INSERT INTO produtos (codigo, nome, descricao, preco, custo, estoque, estoque_minimo, unidade_medida, categoria, ativo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [codigo, nome, descricao, preco, custo, estoque, estoque_minimo, unidade_medida, categoria, ativo]
    );

    return NextResponse.json({ message: 'Produto cadastrado com sucesso!' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    return NextResponse.json({ message: 'Erro ao cadastrar produto.' }, { status: 500 });
  } finally {
    client.release();
  }
}
