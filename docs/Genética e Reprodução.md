# Projeto de Simulação Pecuária: Módulo de Genética e Reprodução

**Versão do Documento:** 1.0
**Data da Última Atualização:** 22/07/2025
**Autor/Equipe:** Erico
**Status:** [Em Desenvolvimento]

---

### 1. Introdução e Objetivos

#### 1.1. Visão Geral
Este documento detalha as regras e mecânicas do sistema de Genética e Reprodução do simulador. O objetivo é criar uma experiência imersiva e realista de melhoramento genético de gado de corte e de leite, com foco no cenário da pecuária brasileira.

#### 1.2. Objetivos Principais
- Implementar um sistema genético duplo: Mendeliano para traços qualitativos e Poligênico para traços quantitativos.
- Diferenciar claramente as aptidões de raças Taurinas, Zebuínas e Leiteiras.
- Simular conceitos genéticos avançados como Endogamia e Heterose.
- Oferecer ao jogador métodos de reprodução realistas: IATF e Monta Natural.
- Conectar o potencial genético do animal com seu desempenho visível (fenótipo) no jogo.

---

### 2. O Modelo Genético

#### 2.1. Arquitetura Dupla
O sistema é composto por dois modelos que rodam em paralelo para cada animal:

1.  **Modelo Mendeliano:** Para traços de herança simples.
2.  **Modelo Poligênico:** Para traços de produção complexos.

#### 2.2. Características Qualitativas (Mendelianas)
Governadas pela lógica do Quadro de Punnett.

| Característica        | Alelos (Dominante / Recessivo) | Lógica de Herança   |
| --------------------- | ------------------------------ | ------------------- |
| Presença de Chifres   | Mocho (P) / Aspado (p)         | Quadro de Punnett   |
| Cor da Pelagem        | [A definir: ex. Preto (B) / Vermelho (b)] | Quadro de Punnett |
|                       |                                |                     |

#### 2.3. Características Quantitativas (Poligênicas)
O valor genético (VG) de um descendente é a `média dos VGs dos pais + variação aleatória`. O desempenho final (fenótipo) é `VG + efeito de ambiente`.

| Característica            | Descrição no Jogo                                     | Heritabilidade (h²) | Raças de Referência (Positiva / Negativa) |
| ------------------------- | ----------------------------------------------------- | ------------------- | ----------------------------------------- |
| **Gerais** |                                                       |                     |                                           |
| Habilidade Materna        | Influencia o desenvolvimento do bezerro.              | ~0.2                | Nelore, Guzerá / Charolês                 |
| Fertilidade               | Chance de concepção a cada ciclo.                     | ~0.1                | Angus, Nelore / Limousin                  |
| Longevidade Produtiva     | Tempo que o animal permanece viável no rebanho.       | ~0.15               | Pardo-Suiço, Nelore / Holandesa           |
| **Rusticidade** |                                                       |                     |                                           |
| Tolerância ao Calor       | Resistência a penalidades de desempenho em climas quentes. | ~0.35               | Sindi, Senepol / Holandesa                |
| Resistência a Doenças     | Reduz a chance de doenças e a necessidade de medicamentos. | ~0.2                | Zebuínos em geral / Taurinos Europeus     |
| **Corte** |                                                       |                     |                                           |
| Ganho de Peso Diário (GPD)| Velocidade de engorda do animal.                      | ~0.4                | Charolês, Angus / Jersey                  |
| Qualidade da Carne        | Nível de marmoreio e maciez da carcaça.               | ~0.5                | Angus, Wagyu / Zebuínos em geral          |
| **Leite** |                                                       |                     |                                           |
| Produção de Leite         | Volume total de leite (kg) por lactação.              | ~0.3                | Holandesa / Nelore                        |
| Teor de Gordura (%)       | Percentual de gordura no leite.                       | ~0.5                | Jersey, Pardo-Suiço / Holandesa           |
| Teor de Proteína (%)      | Percentual de proteína no leite.                      | ~0.4                | Jersey, Pardo-Suiço / Holandesa           |

#### 2.4. Conceitos Genéticos Avançados
- **Endogamia:** O acasalamento entre parentes próximos (>12.5% de parentesco) aplicará uma penalidade percentual na `Fertilidade`, `Resistência a Doenças` e `GPD`.
- **Heterose (Vigor Híbrido):** O cruzamento entre raças geneticamente distantes (Taurino x Zebuíno) concederá um bônus percentual sobre a média dos pais, principalmente em `Fertilidade`, `Habilidade Materna` e `Longevidade`.

---

### 3. O Modelo Reprodutivo

#### 3.1. Ciclo Reprodutivo da Fêmea
- **Ciclo Estral:** Fêmeas aptas (pós-parto e com escore corporal adequado) entrarão no cio a cada ~21 dias no jogo.
- **Gestação:** Duração de ~283 dias (9 meses). Durante este período, a fêmea não entra no cio.
- **Fatores de Influência:** O estado nutricional (pasto bom/ruim) e o estresse ambiental podem atrasar ou inibir o cio.

#### 3.2. Métodos de Reprodução
- **3.2.1. Inseminação Artificial por Tempo Fixo (IATF):**
  - O jogador seleciona um grupo de vacas e um touro do catálogo da `Central de Sêmen`.
  - Custo por animal (protocolo hormonal + sêmen).
  - Taxa de concepção baseada na `Fertilidade` da vaca e na qualidade do sêmen.

- **3.2.2. Monta Natural (a Pasto):**
  - O jogador aloca um touro em um pasto com fêmeas aptas.
  - O touro tentará cobrir as fêmeas que entrarem em cio.
  - A taxa de concepção depende da `Fertilidade` de ambos e da relação touro/vaca (um touro não consegue cobrir um número infinito de fêmeas).

#### 3.3. Central de Sêmen
- Entidade do jogo que oferece um catálogo rotativo de sêmen de touros de alto mérito genético.
- Os preços do sêmen variam conforme os valores genéticos do touro.
- O jogador poderá, no futuro, vender o sêmen de seus próprios touros para a Central.

---

### 4. Raças e Genótipos

#### 4.1. Raças Base (Puras)
[Nesta seção, você irá detalhar cada raça, como fizemos no documento anterior. Use a estrutura de lista para cada raça, definindo sua descrição, foco genético e estratégia de jogo.]

**Exemplo de Estrutura:**

* **Nome da Raça**
    * **Descrição:** ...
    * **Foco Genético:** ...
    * **Estratégia no Jogo:** ...

#### 4.2. Mestiços e Composições Raciais
- O sistema rastreará internamente a porcentagem exata de cada raça em um animal.
- A interface do jogador mostrará composições simplificadas (ex: "Mestiço Angus/Nelore", "Girolando 5/8").

---

### 5. Tarefas Pendentes e Próximos Passos

- [ ] Definir os valores genéticos base (média e desvio padrão) para cada raça e cada característica.
- [ ] Balancear os custos de sêmen, medicamentos e alimentação.
- [ ] Prototipar a interface do jogador para a tela de `Genética do Animal` e `Manejo Reprodutivo`.
- [ ] Desenvolver a lógica para o cálculo do efeito ambiental sobre o fenótipo.
- [ ] Detalhar a lista de raças na seção 4.1.