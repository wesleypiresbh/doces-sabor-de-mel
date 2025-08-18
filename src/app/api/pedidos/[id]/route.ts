import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params; // Corrigido: await params

  const client = await pool.connect();

  try {
    // Buscar detalhes do pedido
    const pedidoResult = await client.query(
      `SELECT 
        p.id, 
        p.numero_pedido, 
        p.data_pedido, 
        c.nome as cliente_nome, 
        c.nome_empresa as cliente_nome_empresa, 
        c.telefone as cliente_telefone, 
        c.endereco as cliente_endereco, 
        p.status, 
        p.total, 
        p.observacoes
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = $1`,
      [id]
    );

    if (pedidoResult.rows.length === 0) {
      return NextResponse.json({ message: 'Pedido não encontrado' }, { status: 404 });
    }

    const pedido = pedidoResult.rows[0];
    pedido.total = parseFloat(pedido.total); // Converte total para número

    // Buscar itens do pedido
    const itensResult = await client.query(
      `SELECT 
        ip.quantidade, 
        ip.preco_unitario, 
        ip.total, 
        prod.nome as produto_nome, 
        prod.codigo as produto_codigo, 
        prod.unidade_medida as produto_unidade_medida
      FROM itens_pedido ip
      JOIN produtos prod ON ip.produto_id = prod.id
      WHERE ip.pedido_id = $1`,
      [id]
    );

    pedido.itens = itensResult.rows;

    return NextResponse.json(pedido);

  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    return NextResponse.json({ message: 'Erro ao buscar detalhes do pedido' }, { status: 500 });
  } finally {
    client.release();
  }
}
