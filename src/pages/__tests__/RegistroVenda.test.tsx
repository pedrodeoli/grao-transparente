import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RegistroVenda } from '../RegistroVenda';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe('RegistroVenda', () => {
  const mockLotes = [
    {
      id_lote: 'lote-1',
      codigo_lote: 'LOTE-2026-100',
      quantidade_pacotes: 10,
      variedade: 'Arábica',
    },
    {
      id_lote: 'lote-2',
      codigo_lote: 'LOTE-2026-200',
      quantidade_pacotes: 0, // Sem estoque
      variedade: 'Conilon',
    }
  ];

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('@grao:lotes', JSON.stringify(mockLotes));
    mockNavigate.mockClear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('deve renderizar os elementos principais do formulário', () => {
    render(
      <MemoryRouter>
        <RegistroVenda />
      </MemoryRouter>
    );

    expect(screen.getByText('Lançar Venda')).toBeInTheDocument();
    expect(screen.getByText('Adicionar Produto')).toBeInTheDocument();
    expect(screen.getByText('O carrinho está vazio')).toBeInTheDocument();
    expect(screen.getByText('Total a pagar:')).toBeInTheDocument();
  });

  it('deve adicionar um item ao carrinho e calcular o total corretamente', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegistroVenda />
      </MemoryRouter>
    );

    // Seleciona o lote (lote-2 não deve aparecer pois tem quantidade 0)
    const selectLote = screen.getByRole('combobox');
    await user.selectOptions(selectLote, 'lote-1');

    // Preenche quantidade e preço
    const inputQtd = screen.getByRole('spinbutton', { name: /Qtd\. Pacotes/i });
    const inputPreco = screen.getByRole('spinbutton', { name: /Preço Unitário/i });

    await user.type(inputQtd, '2');
    await user.type(inputPreco, '25.50');

    // Clica em adicionar
    const btnAdicionar = screen.getByRole('button', { name: /Adicionar ao Carrinho/i });
    await user.click(btnAdicionar);

    // Verifica se o item foi adicionado
    expect(screen.getByText('2x R$ 25.50')).toBeInTheDocument();
    
    // Verifica o cálculo (2 * 25.50 = 51.00)
    // Procuramos especificamente o valor
    const totais = screen.getAllByText(/51\.00/i);
    expect(totais.length).toBeGreaterThanOrEqual(1);
  });

  it('deve bloquear adição ao carrinho se a quantidade solicitada for maior que o estoque', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <RegistroVenda />
      </MemoryRouter>
    );

    const selectLote = screen.getByRole('combobox');
    await user.selectOptions(selectLote, 'lote-1');

    const inputQtd = screen.getByRole('spinbutton', { name: /Qtd\. Pacotes/i });
    const inputPreco = screen.getByRole('spinbutton', { name: /Preço Unitário/i });

    // Tenta adicionar 15 (só tem 10)
    await user.type(inputQtd, '15');
    await user.type(inputPreco, '20');

    const btnAdicionar = screen.getByRole('button', { name: /Adicionar ao Carrinho/i });
    await user.click(btnAdicionar);

    // Verifica se o alert foi chamado com erro
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Quantidade indisponível'));
    
    // Verifica que o item não foi para o carrinho
    expect(screen.getByText('O carrinho está vazio')).toBeInTheDocument();
  });

  it('deve salvar a venda no localStorage e redirecionar', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegistroVenda />
      </MemoryRouter>
    );

    // Preenche carrinho com 1 item
    const selectLote = screen.getByRole('combobox');
    await user.selectOptions(selectLote, 'lote-1');
    await user.type(screen.getByRole('spinbutton', { name: /Qtd\. Pacotes/i }), '1');
    await user.type(screen.getByRole('spinbutton', { name: /Preço Unitário/i }), '10');
    await user.click(screen.getByRole('button', { name: /Adicionar ao Carrinho/i }));

    // Clica em finalizar
    const btnFinalizar = screen.getByRole('button', { name: /CONFIRMAR VENDA/i });
    await user.click(btnFinalizar);

    // Verifica se salvou
    const vendasStorage = JSON.parse(localStorage.getItem('@grao:vendas') || '[]');
    expect(vendasStorage).toHaveLength(1);
    expect(vendasStorage[0].itens).toHaveLength(1);
    expect(vendasStorage[0].valor_total).toBe(10);

    // Verifica se reduziu o estoque (tinha 10, vendeu 1, sobrou 9)
    const lotesStorage = JSON.parse(localStorage.getItem('@grao:lotes') || '[]');
    expect(lotesStorage[0].quantidade_pacotes).toBe(9);

    // Verifica se redirecionou
    expect(mockNavigate).toHaveBeenCalledWith('/estoque');
  });
});
