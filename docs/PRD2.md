Product Requirements Document (PRD): PecuáriaPRO

  Versão: 1.0
  Data: 25 de Julho de 2025
  Autor: Gemini

  ---

  1. Resumo Executivo

  PecuáriaPRO é um jogo de simulação e gerenciamento de negócios
  (Tycoon) focado na pecuária de corte brasileira. O jogador assume o
  papel de um fazendeiro, começando com uma pequena propriedade e um
  rebanho modesto. O objetivo é expandir seus negócios, otimizar a
  produção, melhorar a genética do rebanho e se tornar o pecuarista mais
   bem-sucedido da região. O jogo combina mecânicas de estratégia,
  finanças e educação, simulando os desafios e oportunidades reais do
  agronegócio.

  ---

  2. Visão Geral e Estratégia do Produto

  O PecuáriaPRO visa preencher uma lacuna no mercado de jogos de
  simulação, oferecendo uma experiência autêntica e detalhada do
  agronegócio. Diferente de jogos de fazenda casuais, ele se aprofunda
  em aspectos técnicos como genética bovina (DEPs), flutuações do preço
  da arroba, linhas de crédito rural e o papel de instituições como a
  Embrapa e o SENAR.

  Público-Alvo:
   * Entusiastas de Jogos de Simulação e Tycoon: Jogadores que apreciam
     complexidade, planejamento a longo prazo e otimização de sistemas.
   * Estudantes e Profissionais do Agronegócio: Pessoas com interesse ou
     atuação em zootecnia, agronomia e administração rural que
     reconhecerão e valorizarão o realismo das mecânicas.
   * Jogadores Casuais com Curiosidade: Indivíduos interessados em
     aprender sobre o funcionamento de uma fazenda de gado de corte de
     forma interativa.

  ---

  3. Requisitos Funcionais e Jornada do Usuário

  3.1. Início e Configuração do Jogo (Onboarding)
   * Fluxo: O jogador pode iniciar um novo jogo ou carregar um existente.
   * Requisitos:
       * Ao iniciar um novo jogo, o jogador deve criar seu perfil (nome).
       * O jogador recebe uma fazenda inicial, com tamanho e recursos
         padronizados, igual à dos NPCs iniciais.
       * Um breve tutorial deve explicar os conceitos básicos: interface,
         como ver o rebanho, caixa inicial e objetivos de curto prazo.

  3.2. Mundo do Jogo e Interface Principal
   * Fluxo: A tela principal é o Mapa Geral, de onde o jogador acessa
     todas as outras funcionalidades através de uma Sidebar (Menu Lateral)
      ou clicando em elementos do mapa.
   * Requisitos:
       * Mapa Geral:
           * Visualização de todas as fazendas (do jogador, de NPCs e
             disponíveis para compra).
           * Ícones para acessar Lojas Agropecuárias, Frigoríficos,
             Centrais de Sêmen e Bancos.
           * Exibição de informações climáticas que afetam o crescimento
             do pasto.
       * Header (Cabeçalho):
           * Exibição constante dos KPIs mais importantes: Dinheiro em
             Caixa, Data/Hora do Jogo, e número total de animais.
       * Sidebar (Menu de Navegação):
           * Deve conter links diretos para todas as telas principais do
             jogo: "Meus Rebanhos", "Financeiro", "Comércio de Animais",
             "Centrais de Sêmen", etc.

  3.3. Gestão do Rebanho
   * Fluxo: O núcleo do jogo. O jogador gerencia seus animais, buscando
     eficiência e qualidade.
   * Requisitos:
       * Tela "Meus Rebanhos":
           * Uma tabela detalhada de todos os animais do jogador.
           * Colunas: ID, categoria (bezerro, novilha, touro, etc.),
             idade, peso, raça, saúde, pasto atual.
           * Funcionalidades de filtro e ordenação por qualquer coluna.
       * Ficha do Animal:
           * Ao clicar em um animal, uma tela/modal deve exibir detalhes
             aprofundados: genética (DEPs), histórico de saúde, linhagem
             (pais), etc.
       * Ações com Animais:
           * O jogador deve poder selecionar um ou mais animais para:
             Mover entre pastos, designar para venda, ou aplicar
             medicamentos.

  3.4. Genética e Reprodução
   * Fluxo: O jogador investe em genética para melhorar a qualidade e o
     valor do seu rebanho.
   * Requisitos:
       * Tela "Centrais de Sêmen":
           * O jogador acessa um catálogo de sêmen de touros de alta
             genética.
           * O catálogo deve ser filtrável por raça, características
             (DEPs) e preço.
           * Um sistema de "carrinho de compras" para adquirir múltiplas
             doses de sêmen.
       * Tela "Manejo Reprodutivo":
           * O jogador seleciona as fêmeas aptas em seu rebanho.
           * O jogador seleciona o sêmen (do seu inventário) para realizar
              a inseminação artificial.
           * O sistema deve simular a taxa de sucesso da inseminação e o
             período de gestação.
           * O bezerro resultante deve herdar uma combinação de
             características genéticas do pai e da mãe.
       * Tela "Meu Inventário":
           * Exibe os insumos comprados, como doses de sêmen, medicamentos
              e ração.

  3.5. Economia e Mercado
   * Fluxo: O jogador interage com o mercado para gerar receita e adquirir
      recursos.
   * Requisitos:
       * Tela "Comércio de Animais":
           * Plataforma para comprar animais de NPCs ou vender animais do
             seu rebanho.
       * Tela "Frigoríficos":
           * O jogador pode vender animais para o abate.
           * O preço pago é baseado no peso do animal e no preço da arroba
              do boi, que deve flutuar dinamicamente.
       * Tela "Lojas Agropecuárias":
           * Local para comprar insumos essenciais (medicamentos, ração,
             etc.).
       * Tela "Financeiro":
           * Dashboard com o balanço financeiro: receitas, despesas, fluxo
              de caixa e patrimônio líquido.
           * Gráficos para facilitar a visualização da saúde financeira do
              negócio.
       * Tela "Bancos e Cooperativas":
           * O jogador pode simular e contratar empréstimos/financiamentos
              para alavancar seu crescimento. O sistema deve simular taxas
              de juros e prazos de pagamento.

  3.6. NPCs e Mundo Dinâmico
   * Requisitos:
       * NPCs (outros fazendeiros) devem competir com o jogador: comprar
         terras, vender gado e crescer economicamente.
       * O sistema de tempo deve avançar, simulando o ciclo de vida dos
         bovinos (nascimento, crescimento, envelhecimento) e as estações
         do ano (afetando o pasto).

  ---

  4. Requisitos Não-Funcionais

   * Plataforma: Aplicação web single-page, responsiva para desktops.
   * Tecnologia: Frontend em React (Vite), Backend em Python (com um
     servidor como Flask/FastAPI).
   * Desempenho: A interface deve permanecer fluida, mesmo com a simulação
      de centenas de animais e eventos no backend. As consultas e
     atualizações de estado devem ser otimizadas.
   * Usabilidade: A interface deve ser intuitiva. Informações complexas
     (como dados genéticos) devem ser apresentadas de forma clara, com
     tooltips e explicações.
   * Salvamento: O estado do jogo deve ser salvo automaticamente em
     intervalos regulares e/ou quando o jogador realiza ações importantes.