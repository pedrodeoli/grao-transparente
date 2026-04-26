import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Filter, Receipt } from 'lucide-react';
import type { Venda, Cliente } from '../types';

export function HistoricoVendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  
  // Filtros
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Totais
  const [totalMes, setTotalMes] = useState(0);

  useEffect(() => {
    const vendasSalvas: Venda[] = JSON.parse(localStorage.getItem('@grao:vendas') || '[]');
    const clientesSalvos: Cliente[] = JSON.parse(localStorage.getItem('@grao:clientes') || '[]');
    
    // Sort descending by date
    vendasSalvas.sort((a, b) => new Date(b.data_venda).getTime() - new Date(a.data_venda).getTime());
    
    setVendas(vendasSalvas);
    setClientes(clientesSalvos);

    // Calcular total do mês atual
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const total = vendasSalvas.reduce((acc, venda) => {
      const dataVenda = new Date(venda.data_venda);
      if (dataVenda.getMonth() === mesAtual && dataVenda.getFullYear() === anoAtual) {
        return acc + venda.valor_total;
      }
      return acc;
    }, 0);

    setTotalMes(total);
  }, []);

  // Aplicar filtros
  const vendasFiltradas = vendas.filter(venda => {
    if (!dataInicio && !dataFim) return true;
    
    const dataVenda = new Date(venda.data_venda).getTime();
    
    // Data inicio (começo do dia - considerando fuso horário local)
    const inicio = dataInicio ? new Date(`${dataInicio}T00:00:00`).getTime() : 0;
    // Data fim (final do dia)
    const fim = dataFim ? new Date(`${dataFim}T23:59:59`).getTime() : Infinity;

    return dataVenda >= inicio && dataVenda <= fim;
  });

  // Se não houver filtro ativo, mostra as 10 últimas. Se houver filtro, mostra os resultados.
  const isFiltrando = dataInicio !== '' || dataFim !== '';
  const vendasExibidas = isFiltrando ? vendasFiltradas : vendasFiltradas.slice(0, 10);

  const getNomeCliente = (id?: string) => {
    if (!id) return 'Cliente Não Informado';
    const cliente = clientes.find(c => c.id_cliente === id);
    return cliente ? cliente.nome : 'Cliente Não Encontrado';
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cafe-marrom">Histórico de Vendas</h1>
          <p className="text-gray-600 mt-1">Acompanhe seus resultados e transações</p>
        </div>
      </div>

      {/* Card: Total do Mês */}
      <div className="bg-[#6F4E37] rounded-xl p-6 shadow-md mb-8 text-white flex items-center justify-between">
        <div>
          <p className="text-cafe-bege font-medium mb-1">Total Vendido neste Mês</p>
          <p className="text-3xl md:text-4xl font-black">
            R$ {totalMes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-full hidden sm:block">
          <DollarSign size={40} className="text-cafe-bege" />
        </div>
      </div>

      {/* Seção de Filtros */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Filter size={16} />
          Filtrar Vendas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Data Inicial</label>
            <input 
              type="date" 
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full p-2.5 rounded-md bg-gray-50 border border-gray-200 text-sm outline-none focus:border-cafe-marrom"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Data Final</label>
            <input 
              type="date" 
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full p-2.5 rounded-md bg-gray-50 border border-gray-200 text-sm outline-none focus:border-cafe-marrom"
            />
          </div>
        </div>
      </div>

      {/* Lista de Vendas */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {isFiltrando ? `Resultados da busca (${vendasExibidas.length})` : 'Últimas 10 Vendas'}
          </h2>
        </div>

        {vendasExibidas.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <Receipt size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Nenhuma venda encontrada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vendasExibidas.map((venda) => (
              <div key={venda.id_venda} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-cafe-bege p-3 rounded-lg text-cafe-marrom hidden sm:block">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {getNomeCliente(venda.fk_cliente)}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(venda.data_venda).toLocaleDateString('pt-BR')} às {new Date(venda.data_venda).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">
                        {venda.metodo_pagamento}
                      </span>
                      <span>
                        {venda.itens.length} {venda.itens.length === 1 ? 'item' : 'itens'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left sm:text-right border-t sm:border-0 pt-3 sm:pt-0 border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Valor Total</p>
                  <p className="text-lg font-black text-cafe-verde">
                    R$ {venda.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
