# ☕ Grão Transparente

**Grão Transparente** é uma aplicação web voltada para a agricultura familiar (foco em cafeicultores). O objetivo principal é substituir o controle manual de estoque e vendas por um sistema digital robusto, desenhado com a filosofia **Mobile-First** para ser amplamente utilizável diretamente no campo através de smartphones.

---

## ✨ Funcionalidades

*   **🌱 Registro de Lotes:** Cadastre colheitas com identificação automática (ex: `LOTE-2026-300`), detalhando variedade, método de secagem, notas de cultivo e quantidade inicial de pacotes gerados.
*   **👥 Gestão de Clientes:** Cadastro simples de clientes (nome, contato, endereço) para facilitar a rastreabilidade das vendas.
*   **🛒 Ponto de Venda (PDV) / Carrinho:** Tela intuitiva para registrar novas vendas. Permite adicionar produtos do estoque ao carrinho, com bloqueio contra venda de itens esgotados, além de seleção da forma de pagamento.
*   **📦 Controle de Estoque (Dashboard):** Painel que informa imediatamente a totalidade de lotes registrados e a quantia consolidada de pacotes ainda não vendidos. A cada venda no PDV, o estoque é **automaticamente reduzido**.
*   **🧾 Histórico de Vendas:** Relatório transacional completo que mostra o lucro total do mês corrente e permite filtrar vendas passadas por intervalo de dias, exibindo a hora, cliente, pacotes comprados e valor total.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias modernas para o ecossistema frontend:

*   **React 19** + **TypeScript**
*   **Vite** (ferramenta de build super rápida)
*   **Tailwind CSS (v4)** (estilização ágil focada em classes utilitárias)
*   **React Router DOM** (gerenciamento de rotas e navegação entre telas)
*   **React Hook Form** + **Zod** (para construção performática e validação robusta de formulários)
*   **Lucide React** (biblioteca de ícones clean e elegantes)
*   **LocalStorage** (persistência inicial de dados no navegador do usuário, com código preparado via _Service Pattern_ para uma futura migração com APIs e Bancos de Dados Reais como PostgreSQL).

## 🚀 Como Rodar o Projeto

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação no seu navegador:
   O Vite geralmente expõe o app em [http://localhost:5173/](http://localhost:5173/).

## 🎨 Design e UI
A identidade visual aposta em uma paleta terrosa e quente (utilizando cores como *#6F4E37* [marrom café], *#2E8B57* [verde folha] e *#FAF5F0* [bege areia]), remetendo diretamente ao cultivo do café, enquanto garante contraste adequado para visibilidade sob a luz solar — essencial para uso no campo.
