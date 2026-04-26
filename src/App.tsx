import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { RegistroLote } from './pages/RegistroLote';
import { DashboardEstoque } from './pages/DashboardEstoque';
import { RegistroCliente } from './pages/RegistroCliente';
import { RegistroVenda } from './pages/RegistroVenda';
import { HistoricoVendas } from './pages/HistoricoVendas';
import { Home } from './pages/Home';

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5F0]">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lote/novo" element={<RegistroLote />} />
          <Route path="/clientes/novo" element={<RegistroCliente />} />
          <Route path="/vendas/nova" element={<RegistroVenda />} />
          <Route path="/vendas/historico" element={<HistoricoVendas />} />
          <Route path="/estoque" element={<DashboardEstoque />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
