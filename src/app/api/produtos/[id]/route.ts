import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';
import { Produto } from '@/types';

// GET (obter um produto por ID)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json({ message: 'Erro ao buscar produto' }, { status: 500 });
  }
}

// PUT (atualizar um produto)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body: Produto = await request.json();

  const {
    nome,
    descricao,
    preco,
    custo,
    estoque,
    estoque_minimo,
    unidade_medida,
    categoria,
    ativo,
  } = body;

  try {
    const result = await pool.query(
      `UPDATE produtos
       SET nome = $1, descricao = $2, preco = $3, custo = $4, estoque = $5, estoque_minimo = $6, unidade_medida = $7, categoria = $8, ativo = $9
       WHERE id = $10
       RETURNING *`,
      [nome, descricao, preco, custo, estoque, estoque_minimo, unidade_medida, categoria, ativo, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json({ message: 'Erro ao atualizar produto' }, { status: 500 });
  }
}

// DELETE (excluir um produto)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return NextResponse.json({ message: 'Erro ao excluir produto' }, { status: 500 });
  }
}
