import { useState, useEffect } from 'react';
import { Package, Coffee, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Lote } from '../types';

export function DashboardEstoque() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [totalPacotes, setTotalPacotes] = useState(0);

  useEffect(() => {
    const lotesSalvos = JSON.parse(localStorage.getItem('@grao:lotes') || '[]');
    setLotes(lotesSalvos);
    
    const total = lotesSalvos.reduce((acc: number, lote: Lote) => acc + (lote.quantidade_pacotes || 0), 0);
    setTotalPacotes(total);
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cafe-marrom">Estoque Disponível</h1>
          <p className="text-gray-600 mt-1">Gerencie os pacotes de café dos seus lotes</p>
        </div>
        <Link 
          to="/lote/novo"
          className="hidden md:flex items-center gap-2 bg-cafe-marrom hover:bg-[#5a3f2d] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          <span>Novo Lote</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-cafe-marrom/10 flex items-center gap-4">
          <div className="bg-cafe-bege p-3 rounded-full text-cafe-marrom">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total de Pacotes</p>
            <p className="text-2xl font-bold text-gray-800">{totalPacotes}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-cafe-marrom/10 flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-full text-cafe-verde">
            <Coffee size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Lotes Registrados</p>
            <p className="text-2xl font-bold text-gray-800">{lotes.length}</p>
          </div>
        </div>
      </div>

      {/* Lotes List */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Lotes Recentes</h2>
      
      {lotes.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100 flex flex-col items-center">
          <Package size={48} className="text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">Nenhum lote registrado ainda.</p>
          <p className="text-sm text-gray-400 mt-1">Cadastre o seu primeiro lote para visualizar o estoque.</p>
          <Link 
            to="/lote/novo"
            className="mt-6 md:hidden inline-flex items-center gap-2 bg-cafe-marrom hover:bg-[#5a3f2d] text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            <span>Registrar Lote</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lotes.map((lote) => (
            <div key={lote.id_lote} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-cafe-marrom/30 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-cafe-marrom bg-cafe-bege px-2.5 py-1 rounded-md">
                  {lote.codigo_lote}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Calendar size={14} />
                  {new Date(lote.data_colheita).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
                <Coffee size={18} className="text-cafe-verde" />
                {lote.variedade}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-1">{lote.metodo_secagem}</p>
              
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Estoque:</span>
                <div className="flex items-center gap-1.5 text-cafe-marrom font-bold bg-[#FAF5F0] px-3 py-1 rounded-full group-hover:bg-[#6F4E37] group-hover:text-white transition-colors">
                  <Package size={16} />
                  {lote.quantidade_pacotes || 0} pacotes
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
