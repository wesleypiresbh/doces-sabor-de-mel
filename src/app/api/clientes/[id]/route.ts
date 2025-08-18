import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT * FROM clientes WHERE id = $1', [id]);
      if (res.rows.length === 0) {
        return NextResponse.json({ message: 'Cliente não encontrado' }, { status: 404 });
      }
      return NextResponse.json(res.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao buscar cliente' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await request.json();
  const {
    nome_empresa,
    nome,
    telefone,
    endereco,
    bairro,
    cidade,
    uf,
    cep,
    email,
    ativo,
  } = body;

  try {
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE clientes
         SET nome_empresa = $1, nome = $2, telefone = $3, endereco = $4, bairro = $5, cidade = $6, uf = $7, cep = $8, email = $9, ativo = $10
         WHERE id = $11`,
        [nome_empresa, nome, telefone, endereco, bairro, cidade, uf, cep, email, ativo, id]
      );
      return NextResponse.json({ message: 'Cliente atualizado com sucesso' }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao atualizar cliente' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM clientes WHERE id = $1', [id]);
      return NextResponse.json({ message: 'Cliente excluído com sucesso' }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro ao excluir cliente' }, { status: 500 });
  }
}