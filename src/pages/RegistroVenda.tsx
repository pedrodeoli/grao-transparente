import { useState, useEffect } from 'react';
import { ArrowLeft, Search, ShoppingCart, Plus, Trash2, CreditCard, Banknote, Landmark, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Cliente, Lote, ItemVenda, Venda } from '../types';
import { api } from '../services/api';

export function RegistroVenda() {
  const navigate = useNavigate();

  // Dados armazenados
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [lotesDisponiveis, setLotesDisponiveis] = useState<Lote[]>([]);

  // Estado do Cliente
  const [buscaCliente, setBuscaCliente] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [mostrarResultadosCliente, setMostrarResultadosCliente] = useState(false);

  // Estado do Carrinho
  const [itensCarrinho, setItensCarrinho] = useState<ItemVenda[]>([]);
  
  // Estado do Formulário de Item
  const [selectedLoteId, setSelectedLoteId] = useState('');
  const [quantidadeItem, setQuantidadeItem] = useState<number | ''>('');
  const [precoUnitarioItem, setPrecoUnitarioItem] = useState<number | ''>('');

  // Estado do Pagamento
  const [metodoPagamento, setMetodoPagamento] = useState<Venda['metodo_pagamento']>('Dinheiro');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const clientesApi = await api.getClientes();
        setClientes(clientesApi);

        const lotesApi = await api.getLotes();
        setLotesDisponiveis(lotesApi.filter((l: Lote) => l.quantidade_pacotes > 0));
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    carregarDados();
  }, []);

  // --- Funções de Cliente ---
  const clientesFiltrados = buscaCliente.length > 0 
    ? clientes.filter(c => 
        c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) || 
        c.contato.toLowerCase().includes(buscaCliente.toLowerCase())
      )
    : [];

  const handleSelectCliente = (c: Cliente) => {
    setClienteSelecionado(c);
    setBuscaCliente('');
    setMostrarResultadosCliente(false);
  };

  const handleRemoveCliente = () => {
    setClienteSelecionado(null);
  };

  // --- Funções do Carrinho ---
  const loteSelecionadoInfo = lotesDisponiveis.find(l => l.id_lote === selectedLoteId);
  // Calcula o estoque restante simulado do lote considerando o que já está no carrinho
  const quantidadeNoCarrinho = itensCarrinho
    .filter(item => item.fk_lote === selectedLoteId)
    .reduce((acc, item) => acc + item.quantidade, 0);
  
  const estoqueRestante = loteSelecionadoInfo 
    ? loteSelecionadoInfo.quantidade_pacotes - quantidadeNoCarrinho 
    : 0;

  const handleAddItem = () => {
    if (!selectedLoteId || !quantidadeItem || !precoUnitarioItem) {
      alert("Preencha todos os campos do produto corretamente.");
      return;
    }
    
    if (quantidadeItem <= 0 || precoUnitarioItem < 0) {
      alert("Quantidade e preço devem ser maiores que zero.");
      return;
    }

    if (quantidadeItem > estoqueRestante) {
      alert(`Quantidade indisponível. Estoque restante deste lote: ${estoqueRestante}`);
      return;
    }

    const lote = lotesDisponiveis.find(l => l.id_lote === selectedLoteId);
    if (!lote) return;

    const novoItem: ItemVenda = {
      id_item: Date.now().toString() + Math.floor(Math.random() * 1000),
      fk_lote: lote.id_lote,
      quantidade: Number(quantidadeItem),
      preco_unitario: Number(precoUnitarioItem),
      subtotal: Number(quantidadeItem) * Number(precoUnitarioItem),
      lote_codigo: lote.codigo_lote,
      lote_variedade: lote.variedade
    };

    setItensCarrinho([...itensCarrinho, novoItem]);
    
    // Reset inputs
    setSelectedLoteId('');
    setQuantidadeItem('');
    setPrecoUnitarioItem('');
  };

  const handleRemoveItem = (id_item: string) => {
    setItensCarrinho(itensCarrinho.filter(i => i.id_item !== id_item));
  };

  const valorTotalVenda = itensCarrinho.reduce((acc, item) => acc + item.subtotal, 0);

  // --- Função de Finalização ---
  const handleFinalizarVenda = async () => {
    if (itensCarrinho.length === 0) {
      alert("Adicione pelo menos um item ao carrinho.");
      return;
    }

    try {
      const novaVenda = {
        fk_cliente: clienteSelecionado?.id_cliente,
        itens: itensCarrinho,
        metodo_pagamento: metodoPagamento,
        valor_total: valorTotalVenda,
      };

      await api.criarVenda(novaVenda);

      alert("Venda finalizada com sucesso!");
      navigate('/estoque'); // Redirecionar para o dashboard para ver a baixa
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Ocorreu um erro ao registrar a venda no banco de dados.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F0] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white px-4 py-4 flex items-center border-b border-gray-100 relative">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-600 hover:text-cafe-marrom absolute left-4 p-1 rounded-full hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-bold text-[#5c4a40] text-center w-full">Lançar Venda</h1>
      </header>

      <main className="flex-1 px-5 py-6 md:px-8 max-w-4xl mx-auto w-full mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Lado Esquerdo: Inputs e Seleções */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Secão: Cliente (Opcional) */}
            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#5c4a40] mb-4 flex items-center gap-2">
                <Search size={20} className="text-cafe-verde" />
                Cliente (Opcional)
              </h2>
              
              {clienteSelecionado ? (
                <div className="bg-[#FAF5F0] p-4 rounded-lg flex justify-between items-center border border-cafe-marrom/20">
                  <div>
                    <p className="font-bold text-[#5c4a40]">{clienteSelecionado.nome}</p>
                    <p className="text-sm text-gray-600">{clienteSelecionado.contato}</p>
                  </div>
                  <button onClick={handleRemoveCliente} className="text-red-500 hover:text-red-700 text-sm font-medium p-2">
                    Remover
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={buscaCliente}
                    onChange={(e) => {
                      setBuscaCliente(e.target.value);
                      setMostrarResultadosCliente(true);
                    }}
                    onFocus={() => setMostrarResultadosCliente(true)}
                    placeholder="Buscar por nome ou contato..."
                    className="w-full p-3.5 pl-11 rounded-md bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all text-sm"
                  />
                  <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
                  
                  {/* Dropdown de Busca */}
                  {mostrarResultadosCliente && buscaCliente.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {clientesFiltrados.length > 0 ? (
                        clientesFiltrados.map(c => (
                          <div 
                            key={c.id_cliente} 
                            onClick={() => handleSelectCliente(c)}
                            className="p-3 hover:bg-[#FAF5F0] cursor-pointer border-b border-gray-50 last:border-0"
                          >
                            <p className="font-semibold text-gray-800 text-sm">{c.nome}</p>
                            <p className="text-xs text-gray-500">{c.contato}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500 text-center">Nenhum cliente encontrado.</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Secão: Adicionar Produto ao Carrinho */}
            <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#5c4a40] mb-4 flex items-center gap-2">
                <ShoppingCart size={20} className="text-cafe-verde" />
                Adicionar Produto
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="selectedLoteId" className="block text-sm font-semibold text-[#5c4a40]">Lote Disponível</label>
                  <select
                    id="selectedLoteId"
                    value={selectedLoteId}
                    onChange={(e) => setSelectedLoteId(e.target.value)}
                    className="w-full p-3.5 rounded-md bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all text-sm appearance-none"
                  >
                    <option value="">Selecione um lote...</option>
                    {lotesDisponiveis.map(lote => (
                      <option key={lote.id_lote} value={lote.id_lote}>
                        {lote.codigo_lote} - {lote.variedade} (Estoque: {lote.quantidade_pacotes})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="quantidadeItem" className="block text-sm font-semibold text-[#5c4a40]">
                      Qtd. Pacotes
                    </label>
                    <input
                      id="quantidadeItem"
                      type="number"
                      min="1"
                      value={quantidadeItem}
                      onChange={(e) => setQuantidadeItem(e.target.value ? Number(e.target.value) : '')}
                      className="w-full p-3.5 rounded-md bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all text-sm"
                    />
                    {selectedLoteId && (
                      <p className="text-xs text-gray-500 mt-1">Disponível: {estoqueRestante}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="precoUnitarioItem" className="block text-sm font-semibold text-[#5c4a40]">
                      Preço Unitário (R$)
                    </label>
                    <input
                      id="precoUnitarioItem"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={precoUnitarioItem}
                      onChange={(e) => setPrecoUnitarioItem(e.target.value ? Number(e.target.value) : '')}
                      className="w-full p-3.5 rounded-md bg-gray-50 border border-gray-200 text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddItem}
                  className="w-full flex items-center justify-center gap-2 bg-[#FAF5F0] hover:bg-[#F0E6DD] text-[#6F4E37] border border-[#6F4E37]/30 font-bold py-3.5 rounded-md transition-colors text-sm mt-2"
                >
                  <Plus size={18} /> Adicionar ao Carrinho
                </button>
              </div>
            </section>

          </div>

          {/* Lado Direito: Carrinho e Finalização */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Resumo do Carrinho */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="bg-cafe-verde text-white p-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Resumo da Venda
                </h2>
              </div>
              
              <div className="p-4 flex-1 flex flex-col bg-gray-50/50 min-h-[250px]">
                {itensCarrinho.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <ShoppingCart size={40} className="mb-2 opacity-50" />
                    <p className="text-sm">O carrinho está vazio</p>
                  </div>
                ) : (
                  <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                    {itensCarrinho.map(item => (
                      <div key={item.id_item} className="bg-white p-3 rounded border border-gray-100 flex justify-between items-center shadow-sm">
                        <div>
                          <p className="font-bold text-sm text-gray-800">{item.lote_variedade}</p>
                          <p className="text-xs text-gray-500">{item.quantidade}x R$ {item.preco_unitario.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-[#6F4E37]">R$ {item.subtotal.toFixed(2)}</p>
                          <button onClick={() => handleRemoveItem(item.id_item)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagamento e Total */}
              <div className="p-5 bg-white border-t border-gray-100 space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#5c4a40]">Forma de Pagamento</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { nome: 'Dinheiro', icon: Banknote },
                      { nome: 'PIX', icon: Landmark },
                      { nome: 'Cartão de Crédito', icon: CreditCard },
                      { nome: 'Cartão de Débito', icon: Wallet },
                    ].map(metodo => {
                      const Icon = metodo.icon;
                      const isSelected = metodoPagamento === metodo.nome;
                      return (
                        <button
                          key={metodo.nome}
                          onClick={() => setMetodoPagamento(metodo.nome as Venda['metodo_pagamento'])}
                          className={`flex items-center gap-2 p-2.5 border rounded-md text-sm font-medium transition-colors ${
                            isSelected 
                              ? 'border-cafe-verde bg-green-50 text-cafe-verde' 
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={16} /> {metodo.nome}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                  <span className="text-gray-600 font-semibold">Total a pagar:</span>
                  <span className="text-3xl font-black text-cafe-marrom">
                    R$ {valorTotalVenda.toFixed(2)}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-4xl w-full mx-auto flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-md transition-all text-sm tracking-wide"
          >
            CANCELAR
          </button>
          <button
            onClick={handleFinalizarVenda}
            disabled={itensCarrinho.length === 0}
            className="w-2/3 bg-[#2E8B57] hover:bg-[#236b43] text-white font-bold py-4 rounded-md shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            CONFIRMAR VENDA
          </button>
        </div>
      </div>
    </div>
  );
}
