export interface Lote {
  id_lote: string;
  codigo_lote: string;
  data_colheita: string;
  variedade: 'Arábica' | 'Catuaí' | 'Mundo Novo' | 'Bourbon' | 'Conilon (Robusta)' | 'Outro';
  metodo_secagem: 'Via Seca (Natural)' | 'Via Úmida (Lavado)' | 'Honey (Despolpado)';
  quantidade_pacotes: number;
  notas_cultivo?: string;
}

export interface Produto {
  id_produto: string;
  fk_lote: string;
  tipo_moagem: 'Grão' | 'Moído Grosso' | 'Moído Médio' | 'Moído Fino';
  peso_gramas: number;
  preco_unitario: number;
  quantidade_estoque: number;
}

export interface ItemVenda {
  id_item: string;
  fk_lote: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
  lote_codigo?: string;
  lote_variedade?: string;
}

export interface Venda {
  id_venda: string;
  fk_cliente?: string;
  itens: ItemVenda[];
  metodo_pagamento: 'Dinheiro' | 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito';
  valor_total: number;
  data_venda: string;
}

export interface Cliente {
  id_cliente: string;
  nome: string;
  contato: string;
  endereco: string;
}
