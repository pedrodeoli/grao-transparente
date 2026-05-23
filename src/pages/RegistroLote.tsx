import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Calendar, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const loteSchema = z.object({
  codigo_lote: z.string(),
  data_colheita: z.string().min(1, 'A data de colheita é obrigatória'),
  variedade: z.enum(['Arábica', 'Catuaí', 'Mundo Novo', 'Bourbon', 'Conilon (Robusta)', 'Outro'], {
    message: 'Selecione uma variedade válida'
  }),
  metodo_secagem: z.enum(['Secagem natural', 'Secagem mecânica: secador estático', 'Secagem mecânica: secador rotativo', 'Secagem mista (natural + mecânica)'], {
    message: 'Selecione um método de secagem válido'
  }),
  quantidade_pacotes: z.coerce.number().min(1, 'A quantidade deve ser maior que zero'),
  notas_cultivo: z.string().optional(),
});

type LoteFormData = z.infer<typeof loteSchema>;

export function RegistroLote() {
  const navigate = useNavigate();
  const [codigoGerado, setCodigoGerado] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<LoteFormData>({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      codigo_lote: '',
      data_colheita: '',
      variedade: 'Conilon (Robusta)',
      metodo_secagem: 'Secagem natural',
      quantidade_pacotes: 1,
      notas_cultivo: ''
    }
  });

  useEffect(() => {
    // Generate a code like LOTE-2026-300
    const ano = new Date().getFullYear();
    const sequencial = Math.floor(Math.random() * 900) + 100;
    const codigo = `LOTE-${ano}-${sequencial}`;
    setCodigoGerado(codigo);
    setValue('codigo_lote', codigo);
  }, [setValue]);

  const onSubmit = async (data: LoteFormData) => {
    try {
      await api.criarLote(data);
      alert('Lote registrado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar lote:', error);
      alert('Ocorreu um erro ao salvar o lote.');
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
        <h1 className="text-xl font-bold text-[#5c4a40] text-center w-full">Novo Lote</h1>
      </header>

      {/* Form Area */}
      <main className="flex-1 px-5 py-6 md:px-8 max-w-3xl mx-auto w-full mb-24">
        <form id="lote-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Código do Lote */}
          <div className="space-y-1.5">
            <label htmlFor="codigoLote" className="block text-sm font-semibold text-[#5c4a40]">
              Código do Lote
            </label>
            <input
              id="codigoLote"
              type="text"
              readOnly
              disabled
              value={codigoGerado}
              className="w-full p-3.5 rounded-md bg-gray-50/50 text-gray-400 border border-transparent outline-none cursor-not-allowed text-sm"
            />
          </div>

          {/* Variedade do Grão */}
          <div className="space-y-1.5">
            <label htmlFor="variedadeGrao" className="block text-sm font-semibold text-[#5c4a40]">
              Variedade do Grão <span className="text-red-500">*</span>
            </label>
            <select
              id="variedadeGrao"
              {...register('variedade')}
              className={`w-full p-3.5 rounded-md bg-white border ${errors.variedade ? 'border-red-500' : 'border-gray-100 shadow-sm'} text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all appearance-none text-sm`}
            >
              <option value="Conilon (Robusta)">Conilon (Robusta)</option>
              <option value="Arábica">Arábica</option>
              <option value="Catuaí">Catuaí</option>
              <option value="Mundo Novo">Mundo Novo</option>
              <option value="Bourbon">Bourbon</option>
              <option value="Outro">Outro</option>
            </select>
            {errors.variedade && <p className="text-red-500 text-xs mt-1">{errors.variedade.message}</p>}
          </div>

          {/* Data da Colheita */}
          <div className="space-y-1.5">
            <label htmlFor="dataColheita" className="block text-sm font-semibold text-[#5c4a40]">
              Data da Colheita <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-400" />
              </div>
              <input
                id="dataColheita"
                type="date"
                {...register('data_colheita')}
                className={`w-full p-3.5 pl-11 rounded-md bg-white border ${errors.data_colheita ? 'border-red-500' : 'border-gray-100 shadow-sm'} text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all text-sm`}
              />
            </div>
            {errors.data_colheita && <p className="text-red-500 text-xs mt-1">{errors.data_colheita.message}</p>}
          </div>

          {/* Método de Secagem/Processamento */}
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-[#5c4a40]">
              Método de Secagem/Processamento
            </label>
            <div className="space-y-3.5 mt-2 pl-1">
              {[
                'Secagem natural', 'Secagem mecânica: secador estático', 'Secagem mecânica: secador rotativo', 'Secagem mista (natural + mecânica)'
              ].map((method) => (
                <label key={method} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-[18px] h-[18px]">
                    <input
                      type="radio"
                      value={method}
                      {...register('metodo_secagem')}
                      className="peer sr-only"
                    />
                    <div className="w-[18px] h-[18px] rounded-full border border-gray-300 peer-checked:border-[#6F4E37] peer-checked:bg-white transition-colors"></div>
                    <div className="absolute w-[8px] h-[8px] rounded-full bg-[#6F4E37] scale-0 peer-checked:scale-100 transition-transform"></div>
                  </div>
                  <span className="text-gray-600 text-sm group-hover:text-gray-900 transition-colors">{method}</span>
                </label>
              ))}
            </div>
            {errors.metodo_secagem && <p className="text-red-500 text-xs mt-1">{errors.metodo_secagem.message}</p>}
          </div>

          {/* Quantidade de Pacotes */}
          <div className="space-y-1.5">
            <label htmlFor="quantidadePacotes" className="block text-sm font-semibold text-[#5c4a40]">
              Quantidade de Pacotes <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Package size={18} className="text-gray-400" />
              </div>
              <input
                id="quantidadePacotes"
                type="number"
                min="1"
                {...register('quantidade_pacotes')}
                className={`w-full p-3.5 pl-11 rounded-md bg-white border ${errors.quantidade_pacotes ? 'border-red-500' : 'border-gray-100 shadow-sm'} text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all text-sm`}
                placeholder="Ex: 50"
              />
            </div>
            {errors.quantidade_pacotes && <p className="text-red-500 text-xs mt-1">{errors.quantidade_pacotes.message}</p>}
          </div>

          {/* Notas de Cultivo */}
          <div className="space-y-1.5 pt-2">
            <label htmlFor="notasCultivo" className="block text-sm font-semibold text-[#5c4a40]">
              Notas de Cultivo
            </label>
            <textarea
              id="notasCultivo"
              {...register('notas_cultivo')}
              rows={4}
              placeholder="Ex: Adubo orgânico, clima favorável, altitude 1200m..."
              className="w-full p-4 rounded-md bg-white border border-gray-100 shadow-sm text-gray-800 outline-none focus:ring-2 focus:ring-cafe-marrom/20 focus:border-cafe-marrom transition-all resize-none text-sm placeholder:text-gray-400"
            />
          </div>
        </form>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FAF5F0]">
        <div className="max-w-3xl w-full mx-auto">
          <button
            type="submit"
            form="lote-form"
            disabled={isSubmitting}
            className="w-full bg-[#6F4E37] hover:bg-[#5a3f2d] text-white font-bold py-4 rounded-md shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 text-sm tracking-wide"
          >
            {isSubmitting ? 'SALVANDO...' : 'SALVAR LOTE'}
          </button>
        </div>
      </div>
    </div>
  );
}
