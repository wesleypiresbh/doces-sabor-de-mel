import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params; // Corrigido: await params

  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT codigo, nome, descricao, preco, custo, estoque, estoque_minimo, unidade_medida, categoria, ativo FROM produtos WHERE id = $1', [id]); // Removido imagem_url
      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
      }
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json({ message: 'Erro ao buscar produto' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params; // Corrigido: await params
  const { codigo, nome, descricao, preco, custo, estoque, estoque_minimo, unidade_medida, categoria, ativo } = await request.json(); // Removido imagem_url

  if (!nome || !preco || !codigo) {
    return NextResponse.json({ message: 'Nome, preço e código são obrigatórios.' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query(
      `UPDATE produtos SET 
        codigo = $1, 
        nome = $2, 
        descricao = $3, 
        preco = $4, 
        custo = $5, 
        estoque = $6, 
        estoque_minimo = $7, 
        unidade_medida = $8, 
        categoria = $9, 
        ativo = $10 
      WHERE id = $11`,
      [codigo, nome, descricao, preco, custo, estoque, estoque_minimo, unidade_medida, categoria, ativo, id] // Removido imagem_url
    );

    return NextResponse.json({ message: 'Produto atualizado com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json({ message: 'Erro ao atualizar produto.' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params; // Corrigido: await params

  try {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM produtos WHERE id = $1', [id]);
      return NextResponse.json({ message: 'Produto excluído com sucesso' }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao excluir produto' }, { status: 500 });
  }
}
