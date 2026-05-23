const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db');
const morgan = require('morgan');
const logger = require('./logger');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Morgan para direcionar logs de requisições HTTP para o Winston
const morganStream = {
  write: (message) => logger.info(message.trim()),
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

// ==========================================
// ROTAS DE CLIENTES
// ==========================================
app.get('/api/clientes', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM clientes ORDER BY nome ASC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/clientes', async (req, res, next) => {
  const { nome, contato, endereco } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO clientes (nome, contato, endereco) VALUES ($1, $2, $3) RETURNING *',
      [nome, contato, endereco]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/clientes/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM clientes WHERE id_cliente = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// ==========================================
// ROTAS DE LOTES
// ==========================================
app.get('/api/lotes', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM lotes ORDER BY data_colheita DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/lotes', async (req, res, next) => {
  const { codigo_lote, data_colheita, variedade, metodo_secagem, quantidade_pacotes, notas_cultivo } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO lotes (codigo_lote, data_colheita, variedade, metodo_secagem, quantidade_pacotes, notas_cultivo)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [codigo_lote, data_colheita, variedade, metodo_secagem, quantidade_pacotes, notas_cultivo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/lotes/:id', async (req, res, next) => {
  try {
    await db.query('DELETE FROM lotes WHERE id_lote = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// ==========================================
// ROTAS DE VENDAS
// ==========================================
app.get('/api/vendas', async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT 
          v.id_venda,
          c.nome AS cliente_nome,
          v.data_venda,
          v.valor_total,
          v.metodo_pagamento
      FROM vendas v
      LEFT JOIN clientes c ON v.fk_cliente = c.id_cliente
      ORDER BY v.data_venda DESC
    `);
    
    // Obter itens para cada venda - Para simplicidade, vamos agrupar
    const vendasComItens = await Promise.all(rows.map(async (venda) => {
      const itensResult = await db.query(`
        SELECT iv.*, l.codigo_lote, l.variedade 
        FROM itens_venda iv 
        JOIN lotes l ON iv.fk_lote = l.id_lote 
        WHERE iv.fk_venda = $1
      `, [venda.id_venda]);
      
      return { ...venda, itens: itensResult.rows };
    }));
    
    res.json(vendasComItens);
  } catch (error) {
    next(error);
  }
});

// Registrar venda completa (Transação)
app.post('/api/vendas', async (req, res, next) => {
  const { fk_cliente, metodo_pagamento, valor_total, itens } = req.body;
  
  // Transação no PostgreSQL
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const poolClient = await pool.connect();
  
  try {
    await poolClient.query('BEGIN');
    
    // 1. Inserir a venda principal
    const vendaResult = await poolClient.query(
      `INSERT INTO vendas (fk_cliente, metodo_pagamento, valor_total)
       VALUES ($1, $2, $3) RETURNING id_venda`,
      [fk_cliente || null, metodo_pagamento, valor_total]
    );
    const idVenda = vendaResult.rows[0].id_venda;

    // 2. Inserir itens e reduzir estoque
    for (const item of itens) {
      // Inserir item
      await poolClient.query(
        `INSERT INTO itens_venda (fk_venda, fk_lote, quantidade, preco_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [idVenda, item.fk_lote, item.quantidade, item.preco_unitario, item.subtotal]
      );
      
      // Reduzir estoque do lote
      await poolClient.query(
        `UPDATE lotes SET quantidade_pacotes = quantidade_pacotes - $1
         WHERE id_lote = $2`,
        [item.quantidade, item.fk_lote]
      );
    }
    
    await poolClient.query('COMMIT');
    res.status(201).json({ id_venda: idVenda, message: 'Venda registrada com sucesso' });
  } catch (error) {
    await poolClient.query('ROLLBACK');
    next(error);
  } finally {
    poolClient.release();
  }
});

// ==========================================
// MIDDLEWARE GLOBAL DE TRATAMENTO DE ERROS
// ==========================================
app.use((err, req, res, next) => {
  // Registra o erro completo com Stack Trace no Winston (e no console colorido se dev)
  logger.error('Erro interno ao processar requisição: %s', err.stack || err.message || err);
  
  // Resposta genérica e segura para o cliente
  res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
