-- DDL para o sistema Grão Transparente
-- Dialeto: PostgreSQL (Padrão sugerido, compatível com adaptações leves para outros BDs)

-- Extensão para geração de UUIDs, caso esteja usando PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABELA: clientes
-- ==========================================
CREATE TABLE clientes (
    id_cliente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    contato VARCHAR(100) NOT NULL,
    endereco TEXT NOT NULL
);

-- ==========================================
-- TABELA: lotes
-- ==========================================
CREATE TABLE lotes (
    id_lote UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_lote VARCHAR(50) NOT NULL UNIQUE,
    data_colheita DATE NOT NULL,
    variedade VARCHAR(100) NOT NULL,
    metodo_secagem VARCHAR(100) NOT NULL,
    quantidade_pacotes INT NOT NULL DEFAULT 0,
    notas_cultivo TEXT
);

-- ==========================================
-- TABELA: produtos (Derivados do Lote)
-- ==========================================
CREATE TABLE produtos (
    id_produto UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fk_lote UUID NOT NULL,
    tipo_moagem VARCHAR(50) NOT NULL,
    peso_gramas INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    quantidade_estoque INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_produto_lote FOREIGN KEY (fk_lote) REFERENCES lotes(id_lote) ON DELETE CASCADE
);

-- ==========================================
-- TABELA: vendas
-- ==========================================
CREATE TABLE vendas (
    id_venda UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fk_cliente UUID, -- Nullable para permitir vendas sem cliente cadastrado (avulsas)
    metodo_pagamento VARCHAR(50) NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_venda_cliente FOREIGN KEY (fk_cliente) REFERENCES clientes(id_cliente) ON DELETE SET NULL
);

-- ==========================================
-- TABELA: itens_venda
-- ==========================================
CREATE TABLE itens_venda (
    id_item UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fk_venda UUID NOT NULL,
    fk_lote UUID NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL CHECK (preco_unitario >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    CONSTRAINT fk_item_venda FOREIGN KEY (fk_venda) REFERENCES vendas(id_venda) ON DELETE CASCADE,
    CONSTRAINT fk_item_lote FOREIGN KEY (fk_lote) REFERENCES lotes(id_lote) ON DELETE RESTRICT
);
