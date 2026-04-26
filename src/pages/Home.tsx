import { Coffee, Users, Package, DollarSign, ArrowRight, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const menuItems = [
    {
      title: 'Registrar Lote',
      description: 'Cadastre os cafés recém colhidos',
      icon: Coffee,
      path: '/lote/novo',
      color: 'bg-cafe-verde',
      textColor: 'text-cafe-verde',
    },
    {
      title: 'Registrar Cliente',
      description: 'Adicione novos contatos e clientes',
      icon: Users,
      path: '/clientes/novo',
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
    },
    {
      title: 'Lançar Venda',
      description: 'Venda seus lotes (PDV e Carrinho)',
      icon: DollarSign,
      path: '/vendas/nova',
      color: 'bg-cafe-marrom',
      textColor: 'text-cafe-marrom',
    },
    {
      title: 'Estoque Disponível',
      description: 'Visão geral dos pacotes armazenados',
      icon: Package,
      path: '/estoque',
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
    },
    {
      title: 'Histórico de Vendas',
      description: 'Relatórios e vendas realizadas',
      icon: Receipt,
      path: '/vendas/historico',
      color: 'bg-teal-600',
      textColor: 'text-teal-600',
    },
  ];

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 flex flex-col">
      <div className="text-center mt-6 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-cafe-marrom">Bem-vindo ao Grão Transparente</h1>
        <p className="mt-4 text-slate-600 max-w-lg mx-auto">Sistema completo de Gestão de Lotes, Estoque e Vendas de cafés especiais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-cafe-marrom/30 hover:shadow-md transition-all group flex items-start gap-4"
            >
              <div className={`${item.color} p-4 rounded-xl text-white shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-cafe-marrom transition-colors">{item.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </div>
              <div className="self-center text-gray-300 group-hover:text-cafe-marrom transition-colors">
                <ArrowRight size={20} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
