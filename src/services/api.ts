const API_URL = 'http://localhost:3333/api';

export const api = {
  // Clientes
  getClientes: async () => {
    const res = await fetch(`${API_URL}/clientes`);
    if (!res.ok) throw new Error('Erro ao buscar clientes');
    return res.json();
  },
  criarCliente: async (cliente: any) => {
    const res = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    if (!res.ok) throw new Error('Erro ao criar cliente');
    return res.json();
  },

  // Lotes
  getLotes: async () => {
    const res = await fetch(`${API_URL}/lotes`);
    if (!res.ok) throw new Error('Erro ao buscar lotes');
    return res.json();
  },
  criarLote: async (lote: any) => {
    const res = await fetch(`${API_URL}/lotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lote)
    });
    if (!res.ok) throw new Error('Erro ao criar lote');
    return res.json();
  },

  // Vendas
  getVendas: async () => {
    const res = await fetch(`${API_URL}/vendas`);
    if (!res.ok) throw new Error('Erro ao buscar vendas');
    return res.json();
  },
  criarVenda: async (venda: any) => {
    const res = await fetch(`${API_URL}/vendas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venda)
    });
    if (!res.ok) throw new Error('Erro ao registrar venda');
    return res.json();
  }
};
