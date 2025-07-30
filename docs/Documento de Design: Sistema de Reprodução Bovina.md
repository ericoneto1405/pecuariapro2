# **Documento de Design: Sistema de Reprodução Bovina**

*Última atualização: 28 de julho de 2025*

## 1\. Visão Geral

Este documento detalha a mecânica, a filosofia de design e os requisitos técnicos para os sistemas de **Monta Natural** e **Inseminação Artificial em Tempo Fixo (IATF)** no jogo. O objetivo é criar uma experiência de simulação estratégica, profunda e realista, focada nas decisões de gerenciamento do jogador.

## 2\. Filosofia de Design Principal

Três pilares fundamentais guiam a implementação deste sistema:

### 2.1. Foco na Estratégia, Não no Microgerenciamento

O jogador é um gestor, não um operador. As mecânicas abstraem tarefas repetitivas (ex: aplicação diária de hormônios) e focam nas decisões de alto impacto (quais animais, qual genética, qual nível de investimento).

### 2.2. Livre Arbítrio do Jogador: Risco vs. Recompensa

O jogo nunca deve proibir uma ação do jogador com base em condições (ex: "vaca inelegível"). Em vez disso, a interface deve apresentar **fatos e dados** que deixem claro o risco de uma decisão ruim. O jogador tem a liberdade de fazer investimentos de alto risco, arcando com as consequências financeiras.

### 2.3. Interface Factual vs. Aconselhamento de NPCs

A interface base do jogo apresenta **dados brutos e fatos objetivos**, sem emitir recomendações. O papel de "aconselhar" será uma camada de serviço futura, providenciada por NPCs especialistas contratáveis (Veterinários, Zootecnistas), que interpretarão os dados para o jogador.

## 3\. Mecânicas de Jogo Detalhadas

### 3.1. Monta Natural

  * **Modelo:** O jogador aloca um ou mais touros a um lote de vacas por um período determinado (Estação de Monta).
  * **Decisões Estratégicas:**
      * Duração da Estação (60, 90, 120 dias).
      * Escolha dos touros.
      * Gerenciamento da proporção touro:vaca (ideal 1:25).
  * **Resultado:** Ao final da estação, uma taxa de concepção é calculada com base na fertilidade do touro, condição corporal média do lote e duração. A paternidade dos bezerros é "Desconhecida" ou "Monta Natural", resultando em um valor de venda base.

### 3.2. IATF (Modelo "Pacote de Serviço")

  * **Modelo:** O jogador contrata um "serviço" de IATF para um lote de fêmeas, tomando decisões estratégicas em uma única tela de planejamento.
  * **Fluxo do Jogador:**
    1.  Seleciona um lote de fêmeas.
    2.  Acessa o modal "Contratar Serviço de IATF".
    3.  **Toma as decisões-chave:**
          * **Seleção de Sêmen:** Escolhe um touro do "Catálogo de Sêmen".
          * **Opção de Sexagem:** Decide se usa sêmen convencional ou sexado (macho/fêmea) por um custo adicional.
          * **Nível do Protocolo:** Escolhe entre "Padrão" (mais barato, menor taxa base) ou "Avançado" (mais caro, maior taxa base).
    4.  Analisa o "Extrato de Risco" com a taxa de sucesso estimada e o custo total.
    5.  Confirma o investimento. O processo é executado automaticamente no backend.
  * **Lógica Central (Cálculo da Taxa de Sucesso):** A chance de cada vaca emprenhar é calculada individualmente.
      * **Fórmula Base:** `Taxa de Sucesso = (Taxa Base do Protocolo + Bônus/Penalidades) + Fator Aleatório`
      * **Fatores de Influência (Modificadores):**
          * `[+]` **Qualidade do Protocolo:** "Avançado" oferece uma taxa base maior.
          * `[+]` **Fertilidade do Sêmen:** Atributo específico do sêmen do touro.
          * `[-]` **Condição Corporal (ECC):** Penalidade severa para escores baixos.
          * `[-]` **Dias Pós-Parto (DPP):** Penalidade para vacas com pouco tempo de paridas.
          * `[-]` **Sêmen Sexado:** Penalidade fixa por ter uma taxa de concepção menor na vida real.
          * `[+/-]` **Fator Aleatório:** Um pequeno desvio (+/- 5%) para simular a imprevisibilidade biológica.
  * **Distinção Crucial (Sêmen):**
      * **DEPs (Diferença Esperada na Progênie):** Atributos genéticos que afetam a *qualidade do bezerro* (ganho de peso, etc.).
      * **Taxa de Fertilidade:** Atributo que afeta a *chance de a vaca emprenhar*.

## 4\. Apresentação e UI/UX

A interface deve ser puramente informativa.

  * **Alertas Visuais:** Ícones (`⚠️`) e tooltips devem apresentar fatos, não opiniões.
      * **Exemplo de Tooltip Factual:**
        ```
        ⚠️ Fato: ECC 2/5. Este escore resulta em uma penalidade severa na taxa de concepção.
        ```
  * **Extrato de Risco:** O modal de confirmação deve detalhar como a taxa de sucesso foi calculada, empoderando o jogador.
      * **Exemplo de Resumo Factual:**

        > **CÁLCULO DE RISCO DA OPERAÇÃO**

        >   * Taxa Base do Protocolo "Avançado": **+55%**
        >   * Fator Fertilidade Sêmen "Touro X": **+5%**
        >   * Fator Lote (ECC médio 2.9/5): **-20%**
        >   * Fator Sêmen Sexado (Fêmea): **-10%**

        > **TAXA DE SUCESSO ESTIMADA: 30%**

## 5\. Arquitetura Técnica

### 5.1. Divisão de Responsabilidades

  * **Backend (O Cérebro):**

      * Executa toda a lógica de cálculo.
      * Gerencia o estado dos animais.
      * Processa os resultados.
      * Armazena os dados (Catálogo de Sêmen, etc.).

  * **Frontend (O Painel de Controle):**

      * Exibe os dados fornecidos pelo backend.
      * Coleta as escolhas do jogador.
      * Envia as ordens (requisições) para o backend.

### 5.2. Resumo do Prompt para Backend

  * **Modelos de Dados:** `Animal` (com statusReprodutivo, ECC, DPP) e `CatalogoSemen` (com DEPs, taxaFertilidade, precoDose, etc.).
  * **Serviço de Lógica (`ReproductiveService`):** Funções para `iniciarIATF` e `iniciarMontaNatural` que encapsulam toda a lógica de cálculo e atualização de estado.
  * **Endpoints da API:** `POST /api/reproduction/iatf`, `POST /api/reproduction/natural-mating`, `GET /api/catalog/semen`.

## 6\. Dados de Referência

  * A **taxa de sucesso média da IATF** em condições comerciais no Brasil é de **50% a 60%**. Este valor serve como um ótimo balizador para a taxa base de concepção no jogo.