import { Menu, Coffee, Home, Package, DollarSign, Users, Receipt } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Início', path: '/', icon: Home },
    { name: 'Registrar Lote', path: '/lote/novo', icon: Coffee },
    { name: 'Registrar Cliente', path: '/clientes/novo', icon: Users },
    { name: 'Estoque', path: '/estoque', icon: Package },
    { name: 'Vendas', path: '/vendas/nova', icon: DollarSign },
    { name: 'Histórico de Vendas', path: '/vendas/historico', icon: Receipt },
  ];

  return (
    <nav className="bg-cafe-marrom text-cafe-bege shadow-md">
      <div className="px-4 py-3 flex justify-between items-center">
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 font-bold text-xl">
          <Coffee size={24} className="text-cafe-verde" />
          <span>Grão Transparente</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-cafe-verde"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-cafe-marrom pb-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 border-l-4 transition-colors ${
                  isActive 
                    ? 'border-cafe-verde bg-black/20 text-white' 
                    : 'border-transparent text-cafe-bege hover:bg-black/10'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-cafe-verde' : 'opacity-80'} />
                <span className="font-medium">{link.name}</span>
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  );
}
