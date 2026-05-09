-- DML e Operações CRUD para o sistema Grão Transparente
-- ============================================================================
-- Este script simula o comportamento da aplicação ao persistir e consultar dados.
-- ============================================================================

-- ============================================================================
-- CREATE (Inserção de Dados)
-- ============================================================================

-- 1. Inserir Clientes
INSERT INTO clientes (id_cliente, nome, contato, endereco)
VALUES 
    ('c1111111-1111-1111-1111-111111111111', 'João da Silva', 'joao@email.com - (11) 99999-9999', 'Rua das Flores, 123 - São Paulo/SP'),
    ('c2222222-2222-2222-2222-222222222222', 'Cafeteria Aroma', 'contato@aroma.com.br - (31) 88888-8888', 'Av. Central, 456 - Belo Horizonte/MG');

-- 2. Inserir Lotes de Café
INSERT INTO lotes (id_lote, codigo_lote, data_colheita, variedade, metodo_secagem, quantidade_pacotes, notas_cultivo)
VALUES 
    ('L1111111-1111-1111-1111-111111111111', 'LT-2023-01', '2023-05-15', 'Arábica', 'Via Úmida (Lavado)', 500, 'Lote com notas frutadas e acidez equilibrada.'),
    ('L2222222-2222-2222-2222-222222222222', 'LT-2023-02', '2023-06-20', 'Catuaí', 'Via Seca (Natural)', 300, 'Lote com corpo denso e notas de chocolate.');

-- 3. Inserir Produtos (Derivados do lote, especificando moagem)
INSERT INTO produtos (fk_lote, tipo_moagem, peso_gramas, preco_unitario, quantidade_estoque)
VALUES 
    ('L1111111-1111-1111-1111-111111111111', 'Grão', 250, 25.00, 100),
    ('L1111111-1111-1111-1111-111111111111', 'Moído Médio', 250, 27.00, 50);

-- 4. Registrar o Cabeçalho de uma Venda
INSERT INTO vendas (id_venda, fk_cliente, metodo_pagamento, valor_total, data_venda)
VALUES 
    ('V1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'PIX', 500.00, NOW());

-- 5. Registrar os Itens da Venda
INSERT INTO itens_venda (fk_venda, fk_lote, quantidade, preco_unitario, subtotal)
VALUES 
    ('V1111111-1111-1111-1111-111111111111', 'L1111111-1111-1111-1111-111111111111', 20, 25.00, 500.00);


-- ============================================================================
-- READ (Consulta de Dados)
-- ============================================================================

-- 1. Listar todos os clientes cadastrados
SELECT * FROM clientes ORDER BY nome ASC;

-- 2. Consultar lotes com estoque disponível (quantidade de pacotes maior que 0)
SELECT id_lote, codigo_lote, variedade, quantidade_pacotes 
FROM lotes 
WHERE quantidade_pacotes > 0;

-- 3. Histórico de vendas com dados do cliente (Inner/Left Join)
SELECT 
    v.id_venda,
    c.nome AS nome_cliente,
    v.data_venda,
    v.valor_total,
    v.metodo_pagamento
FROM vendas v
LEFT JOIN clientes c ON v.fk_cliente = c.id_cliente
ORDER BY v.data_venda DESC;

-- 4. Consultar detalhadamente os itens de uma venda específica
SELECT 
    iv.id_item,
    l.codigo_lote,
    l.variedade,
    iv.quantidade,
    iv.preco_unitario,
    iv.subtotal
FROM itens_venda iv
JOIN lotes l ON iv.fk_lote = l.id_lote
WHERE iv.fk_venda = 'V1111111-1111-1111-1111-111111111111';


-- ============================================================================
-- UPDATE (Atualização de Dados)
-- ============================================================================

-- 1. Atualizar informações de contato e endereço de um cliente
UPDATE clientes
SET endereco = 'Nova Avenida, 789 - Belo Horizonte/MG',
    contato = 'novo.contato@aroma.com.br'
WHERE id_cliente = 'c2222222-2222-2222-2222-222222222222';

-- 2. Dar baixa no estoque de um lote após uma venda ser concluída
UPDATE lotes
SET quantidade_pacotes = quantidade_pacotes - 20
WHERE id_lote = 'L1111111-1111-1111-1111-111111111111' 
  AND quantidade_pacotes >= 20; -- Prevenção de estoque negativo a nível de query


-- ============================================================================
-- DELETE (Remoção de Dados)
-- ============================================================================

-- 1. Excluir um cliente específico 
-- (Suas vendas permanecerão no histórico com fk_cliente = NULL devido ao ON DELETE SET NULL)
DELETE FROM clientes
WHERE id_cliente = 'c1111111-1111-1111-1111-111111111111';

-- 2. Cancelar e remover uma venda inteira
-- (Os itens na tabela itens_venda vinculados a ela serão apagados devido ao ON DELETE CASCADE)
DELETE FROM vendas
WHERE id_venda = 'V1111111-1111-1111-1111-111111111111';
