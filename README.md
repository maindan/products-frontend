# Products Manager - Frontend

O Products Manager é uma aplicação web moderna voltada para o gerenciamento de produtos, insumos e controle de produção. Desenvolvida para oferecer uma interface intuitiva e performática, a ferramenta permite o acompanhamento detalhado de estoques e a sugestão inteligente de produção.

## Tecnologias Utilizadas

O projeto foi construído com as melhores práticas de desenvolvimento frontend:

- Next.js: Framework React para produção com roteamento otimizado.
- React Query (TanStack Query): Gerenciamento de estado assíncrono e cache de dados da API.
- Shadcn/UI: Componentes de interface acessíveis e altamente customizáveis.
- Tailwind CSS: Estilização baseada em utilitários para um design responsivo.
- Lucide React: Conjunto de ícones leves e elegantes.

## Funcionalidades Principais

### Gerenciamento de Produtos
- Listagem e Busca: Visualização clara de todos os produtos com filtros de pesquisa.
- CRUD Completo: Criação, edição e exclusão de produtos via modais.
- Composição de Custos: Definição de insumos para cada produto e cálculo de preço de venda.

### Gerenciamento de Materiais (Insumos)
- Controle total sobre as matérias-primas.
- Busca rápida e atualização de estoque de insumos.

### Produção Inteligente
- Sugestões de Produção: O sistema analisa o estoque atual de insumos e sugere quais produtos podem ser fabricados.

### Experiência do Usuário (UX)
- Modais: Fluxos de criação e edição sem sair da tela principal.
- Feedback Visual: Notificações via Toasts para confirmação de ações.
- Interface Limpa: Foco na usabilidade e agilidade no gerenciamento.

## Instalação e Execução

Para rodar este projeto localmente, siga os passos abaixo:

1. Clone o repositório:
   git clone https://github.com/maindan/products-frontend.git

2. Acesse a pasta do projeto:
   cd products-frontend

3. Instale as dependências:
   npm install

4. Inicie o servidor de desenvolvimento:
   npm run dev

5. Acesse no navegador:
   O projeto estará disponível em http://localhost:3000.
