import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';

// GET (obter um cliente por ID)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Cliente não encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return NextResponse.json({ message: 'Erro ao buscar cliente' }, { status: 500 });
  }
}

// PUT (atualizar um cliente)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { nome, telefone, endereco, nome_empresa, bairro } = body;

  try {
    const result = await pool.query(
      `UPDATE clientes
       SET nome = $1, telefone = $2, endereco = $3, nome_empresa = $4, bairro = $5
       WHERE id = $6
       RETURNING *`,
      [nome, telefone, endereco, nome_empresa, bairro, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Cliente não encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json({ message: 'Erro ao atualizar cliente' }, { status: 500 });
  }
}

// DELETE (excluir um cliente)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Cliente não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return NextResponse.json({ message: 'Erro ao excluir cliente' }, { status: 500 });
  }
}
