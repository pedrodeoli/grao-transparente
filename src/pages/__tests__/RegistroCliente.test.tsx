import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RegistroCliente } from '../RegistroCliente';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe('RegistroCliente', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('deve renderizar o formulário corretamente', () => {
    render(
      <MemoryRouter>
        <RegistroCliente />
      </MemoryRouter>
    );

    expect(screen.getByText('Novo Cliente')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Nome Completo/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Contato/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Endereço Completo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SALVAR CLIENTE/i })).toBeInTheDocument();
  });

  it('deve mostrar erros de validação ao tentar submeter com campos vazios', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegistroCliente />
      </MemoryRouter>
    );

    // Clicar em salvar sem preencher nada
    const btnSalvar = screen.getByRole('button', { name: /SALVAR CLIENTE/i });
    await user.click(btnSalvar);

    // Esperar os erros do zod
    expect(await screen.findByText('O nome deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    expect(await screen.findByText('Informe um telefone ou email de contato válido')).toBeInTheDocument();
    expect(await screen.findByText('Informe o endereço completo')).toBeInTheDocument();
    
    // Garantir que não salvou
    expect(localStorage.getItem('@grao:clientes')).toBeNull();
  });

  it('deve salvar os dados corretamente no localStorage e redirecionar ao preencher tudo certo', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegistroCliente />
      </MemoryRouter>
    );

    // Preenchendo campos
    await user.type(screen.getByRole('textbox', { name: /Nome Completo/i }), 'João da Silva');
    await user.type(screen.getByRole('textbox', { name: /Contato/i }), 'joao@email.com');
    await user.type(screen.getByRole('textbox', { name: /Endereço Completo/i }), 'Rua das Flores, 123');

    // Salvando
    const btnSalvar = screen.getByRole('button', { name: /SALVAR CLIENTE/i });
    await user.click(btnSalvar);

    // Verificando submissão
    await waitFor(() => {
      const clientesStorage = JSON.parse(localStorage.getItem('@grao:clientes') || '[]');
      expect(clientesStorage).toHaveLength(1);
      expect(clientesStorage[0].nome).toBe('João da Silva');
      expect(clientesStorage[0].contato).toBe('joao@email.com');
      expect(clientesStorage[0].endereco).toBe('Rua das Flores, 123');
    });

    // Validando alertas e navegação
    expect(alertMock).toHaveBeenCalledWith('Cliente registrado com sucesso!');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
