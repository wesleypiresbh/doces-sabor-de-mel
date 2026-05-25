import { NextResponse } from 'next/server';
import pool from '@/lib/neon/client';
import type { ItemPedido, Cliente } from '@/types';

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT 
        p.id, 
        p.numero_pedido, 
        p.data_pedido, 
        c.nome as cliente_nome, 
        c.nome_empresa as cliente_nome_empresa, 
        p.status, 
        p.total, 
        p.observacoes
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.data_pedido DESC`
    );
    // Converte total para número
    const pedidos = result.rows.map(row => ({
      ...row,
      total: parseFloat(row.total),
    }));
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json({ message: 'Erro ao buscar pedidos' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const { cliente, itens, observacoes } = await request.json() as { 
    cliente: Cliente | null, 
    itens: ItemPedido[], 
    observacoes: string 
  };

  if (!cliente) {
    return NextResponse.json({ message: 'Cliente não selecionado' }, { status: 400 });
  }
  if (itens.length === 0) {
    return NextResponse.json({ message: 'O pedido deve ter pelo menos um item' }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Inicia a transação

    const totalPedido = itens.reduce((total, item) => total + item.total, 0);

    // 1. Inserir o pedido principal
    const pedidoResult = await client.query(
      'INSERT INTO pedidos (cliente_id, observacoes, status, total) VALUES ($1, $2, $3, $4) RETURNING id, numero_pedido',
      [cliente.id, observacoes, 'pendente', totalPedido]
    );
    const pedidoId = pedidoResult.rows[0].id;
    const numeroPedido = pedidoResult.rows[0].numero_pedido;

    // 2. Inserir os itens do pedido
    for (const item of itens) {
      if (!item.produto_id) {
        return NextResponse.json({ message: 'Cada item do pedido deve ter um produto selecionado.' }, { status: 400 });
      }
      await client.query(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, total) VALUES ($1, $2, $3, $4, $5)',
        [pedidoId, item.produto_id, item.quantidade, item.preco_unitario, item.total]
      );
    }

    await client.query('COMMIT'); // Finaliza a transação com sucesso

    return NextResponse.json({ message: 'Pedido criado com sucesso', pedidoId, numeroPedido }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK'); // Desfaz a transação em caso de erro
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json({ message: 'Erro ao criar pedido' }, { status: 500 });
  } finally {
    client.release();
  }
}