import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, User, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Cliente } from '../types';

const clienteSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  contato: z.string().min(8, 'Informe um telefone ou email de contato válido'),
  endereco: z.string().min(5, 'Informe o endereço completo'),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export function RegistroCliente() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: '',
      contato: '',
      endereco: ''
    }
  });

  const onSubmit = async (data: ClienteFormData) => {
    try {
      const novoCliente: Cliente = {
        id_cliente: uuidv4(),
        ...data,
      };

      const clientesSalvos = JSON.parse(localStorage.getItem('@grao:clientes') || '[]');
      localStorage.setItem('@grao:clientes', JSON.stringify([...clientesSalvos, novoCliente]));

      alert('Cliente registrado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Ocorreu um erro ao salvar o cliente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5F0] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white px-4 py-4 flex items-center border-b border-gray-100 relative">
        <button 
          type="button"
          onClick={() => navigate(-1)} 
          className="text-gray-600 hover:text-cafe-marrom absolute left-4 p-1 rounded-full hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-bold text-[#5c4a40] text-center w-full">Novo Cliente</h1>
      </header>

      {/* Form Area */}
      <main className="flex-1 px-5 py-6 md:px-8 max-w-3xl mx-auto w-full mb-24">
        <form id="cliente-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Nome */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#5c4a40]">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                {...register('nome')}
                className={`w-full p-3.5 pl-11 rounded-md bg-white border ${errors.nome ? 'border-red-500' : 'border-gray-100 shadow-sm'} text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all text-sm`}
                placeholder="Ex: João da Silva"
              />
            </div>
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          {/* Contato */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#5c4a40]">
              Contato (Telefone/Email) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                {...register('contato')}
                className={`w-full p-3.5 pl-11 rounded-md bg-white border ${errors.contato ? 'border-red-500' : 'border-gray-100 shadow-sm'} text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all text-sm`}
                placeholder="Ex: (11) 99999-9999"
              />
            </div>
            {errors.contato && <p className="text-red-500 text-xs mt-1">{errors.contato.message}</p>}
          </div>

          {/* Endereço */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#5c4a40]">
              Endereço Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <textarea
                {...register('endereco')}
                rows={4}
                className={`w-full p-3.5 pl-11 rounded-md bg-white border ${errors.endereco ? 'border-red-500' : 'border-gray-100 shadow-sm'} text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all resize-none text-sm placeholder:text-gray-400`}
                placeholder="Rua, Número, Bairro, Cidade - Estado"
              />
            </div>
            {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco.message}</p>}
          </div>
        </form>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FAF5F0]">
        <div className="max-w-3xl w-full mx-auto">
          <button
            type="submit"
            form="cliente-form"
            disabled={isSubmitting}
            className="w-full bg-[#6F4E37] hover:bg-[#5a3f2d] text-white font-bold py-4 rounded-md shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 text-sm tracking-wide"
          >
            {isSubmitting ? 'SALVANDO...' : 'SALVAR CLIENTE'}
          </button>
        </div>
      </div>
    </div>
  );
}
