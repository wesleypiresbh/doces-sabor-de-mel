import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Buscar detalhes do pedido
    const pedidoResult = await pool.query(
      `SELECT
         p.id,
         p.numero_pedido,
         p.data_pedido,
         p.status,
         p.total,
         p.observacoes,
         c.nome AS cliente_nome,
         c.nome_empresa AS cliente_nome_empresa,
         c.email AS cliente_email,
         c.telefone AS cliente_telefone,
         c.endereco AS cliente_endereco
       FROM pedidos p
       JOIN clientes c ON p.cliente_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (pedidoResult.rows.length === 0) {
      return NextResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });
    }

    const pedido = pedidoResult.rows[0];

    // Buscar itens do pedido
    const itensResult = await pool.query(
      `SELECT
         pi.quantidade,
         pi.preco_unitario,
         pr.nome AS produto_nome,
         pr.codigo AS produto_codigo
       FROM pedido_itens pi
       JOIN produtos pr ON pi.produto_id = pr.id
       WHERE pi.pedido_id = $1`,
      [id]
    );

    const itens = itensResult.rows;

    const response = {
      ...pedido,
      itens,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    return NextResponse.json({ message: 'Erro ao buscar detalhes do pedido' }, { status: 500 });
  }
}
