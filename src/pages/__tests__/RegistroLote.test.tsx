import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RegistroLote } from '../RegistroLote';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe('RegistroLote', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('deve renderizar o formulário corretamente', () => {
    render(
      <MemoryRouter>
        <RegistroLote />
      </MemoryRouter>
    );

    expect(screen.getByText('Novo Lote')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Código do Lote/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Variedade do Grão/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Data da Colheita/i)).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /Quantidade de Pacotes/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Notas de Cultivo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SALVAR LOTE/i })).toBeInTheDocument();
  });

  it('deve mostrar erros de validação ao tentar submeter com campos obrigatórios vazios', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegistroLote />
      </MemoryRouter>
    );

    // Tentamos salvar sem preencher a data (o react-hook-form tem default pra quase tudo menos data)
    const btnSalvar = screen.getByRole('button', { name: /SALVAR LOTE/i });
    await user.click(btnSalvar);

    // Deve aparecer a mensagem de erro da data de colheita exigida pelo Zod
    expect(await screen.findByText('A data de colheita é obrigatória')).toBeInTheDocument();
    
    // O localStorage não deve ter sido alterado
    expect(localStorage.getItem('@grao:lotes')).toBeNull();
  });

  it('deve salvar os dados corretamente no localStorage e redirecionar ao preencher tudo certo', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegistroLote />
      </MemoryRouter>
    );

    // Preenche o formulário
    const inputData = screen.getByLabelText(/Data da Colheita/i);
    await user.type(inputData, '2026-05-10');

    const selectVariedade = screen.getByRole('combobox', { name: /Variedade do Grão/i });
    await user.selectOptions(selectVariedade, 'Catuaí');

    // Acessa o radio (usando o role e nome do label)
    const radioSecagem = screen.getByRole('radio', { name: 'Secagem mecânica: secador estático' });
    await user.click(radioSecagem);

    const inputQtd = screen.getByRole('spinbutton', { name: /Quantidade de Pacotes/i });
    await user.clear(inputQtd); // limpa o default 1
    await user.type(inputQtd, '50');

    const inputNotas = screen.getByRole('textbox', { name: /Notas de Cultivo/i });
    await user.type(inputNotas, 'Lote especial teste');

    // Salvar
    const btnSalvar = screen.getByRole('button', { name: /SALVAR LOTE/i });
    await user.click(btnSalvar);

    // Verifica se salvou usando waitFor para aguardar o comportamento async do react-hook-form
    await waitFor(() => {
      const lotesStorage = JSON.parse(localStorage.getItem('@grao:lotes') || '[]');
      expect(lotesStorage).toHaveLength(1);
      expect(lotesStorage[0].variedade).toBe('Catuaí');
      expect(lotesStorage[0].quantidade_pacotes).toBe(50);
      expect(lotesStorage[0].data_colheita).toBe('2026-05-10');
      expect(lotesStorage[0].metodo_secagem).toBe('Secagem mecânica: secador estático');
      expect(lotesStorage[0].notas_cultivo).toBe('Lote especial teste');
    });

    // Verifica se exibiu o alerta
    expect(alertMock).toHaveBeenCalledWith('Lote registrado com sucesso!');

    // Verifica se redirecionou
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
