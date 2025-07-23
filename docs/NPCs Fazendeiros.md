Perfeito\! Nome definido. Isso dá identidade ao projeto.

Vou atualizar o blueprint técnico para refletir o nome oficial do jogo, **PECUARIAPRO2**. Isso é importante para que o Cursor AI e qualquer desenvolvedor utilize os nomes corretos para os repositórios, pastas e arquivos.

Aqui está o documento Markdown revisado e finalizado:

-----

# Blueprint Técnico: PECUARIAPRO2 - NPCs Híbridos

## 1\. Visão Geral da Arquitetura

Este documento descreve a arquitetura para criar um sistema de 20 NPCs fazendeiros com comportamento dinâmico e realista para o jogo **PECUARIAPRO2**. A arquitetura é híbrida, combinando IA tradicional (para controle de estado e rotinas) com IA Generativa (para cognição, diálogo e tomada de decisão complexa).

O sistema é dividido em três componentes principais:

1.  **Backend (Python + Flask)**: O cérebro central do sistema. Ele gerencia o estado de todos os 20 NPCs, executa os ciclos de pensamento, processa a lógica de comportamento e se comunica com o OLLAMA.
2.  **Frontend (React + JSX)**: A camada de apresentação visual. Ele renderiza o mundo do jogo, os NPCs, o jogador e as interações. Ele consome a API do backend para exibir o comportamento e o diálogo dos NPCs.
3.  **Cérebro Generativo (OLLAMA + Llama 3)**: O processador de linguagem e cognição. É consultado pelo backend para gerar diálogos, tomar decisões complexas e reagir a situações novas.

**Fluxo Principal:**
`Mundo do Jogo (Frontend) <=> Lógica Central (Backend) <=> Cognição (OLLAMA)`

-----

## 2\. Estrutura de Projeto Recomendada

```
/PECUARIAPRO2/
├── /pecuariapro2-backend/        # Backend em Python/Flask
│   ├── venv/
│   ├── state/
│   │   └── npcs_save.json        # Arquivo de persistência do estado dos NPCs
│   ├── app.py                    # Lógica principal da API e Flask
│   ├── npc_manager.py            # Classe para gerenciar todos os NPCs
│   ├── npc_state.py              # Definição da classe de estado de um NPC
│   └── requirements.txt
│
└── /pecuariapro2-frontend/       # Frontend em React
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── npcService.js     # Funções para chamar o backend
    │   ├── components/
    │   │   ├── NPC.jsx           # Componente para renderizar um único NPC
    │   │   └── GameWorld.jsx     # Componente principal que renderiza o jogo
    │   ├── state/
    │   │   └── useNPCStore.js    # Store (Zustand/Redux) para o estado dos NPCs
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

-----

## 3\. O Backend: `pecuariapro2-backend`

### 3.1. Objetivo

  - Manter o estado completo e dinâmico de todos os 20 NPCs em tempo real.
  - Executar "ciclos de pensamento" autônomos para cada NPC em intervalos regulares.
  - Fornecer endpoints de API para o frontend interagir com os NPCs e obter seus estados.
  - Agir como o único ponto de contato com a API do OLLAMA, protegendo a lógica de prompt.

### 3.2. Ferramentas

  - **Linguagem:** Python 3.10+
  - **Framework:** Flask (ou FastAPI)
  - **Bibliotecas:**
      - `requests`: Para comunicação com OLLAMA.
      - `flask-cors`: Para permitir a comunicação com o frontend.

### 3.3. Estruturas de Dados Centrais (`npc_state.py`)

A classe `NPCState` é o coração de cada NPC.

```python
# npc_state.py
from dataclasses import dataclass, field
from typing import List, Dict

@dataclass
class Memory:
    event: str
    feeling: str
    timestamp: str

@dataclass
class NPCState:
    id: str  # Ex: "npc_01", "npc_02", ...
    name: str

    # Componentes da Mente Simulada
    personality: Dict[str, float]
    mood: str  # "Neutro", "Contente", "Irritado", "Preocupado", etc.
    physical_state: Dict[str, float]  # {'energia': 1.0, 'fome': 0.0}
    
    current_focus: Dict[str, str] = field(default_factory=dict) # O que o NPC está pensando/fazendo agora
    
    long_term_goals: List[str] = field(default_factory=list)
    short_term_goals: List[str] = field(default_factory=list)

    memories: List[Memory] = field(default_factory=list)
    relationships: Dict[str, float] = field(default_factory=dict) # {'player': 0.5, 'npc_02': 0.8}

    # Estado no Jogo
    position: Dict[str, float] = field(default_factory=lambda: {'x': 0, 'y': 0})
    current_action: Dict[str, str] = field(default_factory=lambda: {'type': 'IDLE', 'target': ''})
    current_dialogue: str = ""
```

### 3.4. Gerenciamento de Estado (`npc_manager.py`)

A classe `NPCManager` irá instanciar e gerenciar o dicionário com os 20 NPCs.

```python
# npc_manager.py
import json
from typing import Dict
from npc_state import NPCState

class NPCManager:
    def __init__(self):
        self.npcs: Dict[str, NPCState] = {}
        self.load_npcs()

    def load_npcs(self):
        # Carrega as definições iniciais de um arquivo JSON
        # e cria os 20 objetos NPCState.
        # Por simplicidade, pode-se criar os 20 aqui para começar.
        pass

    def get_npc(self, npc_id: str) -> NPCState:
        return self.npcs.get(npc_id)

    def get_all_states(self) -> Dict[str, Dict]:
        # Retorna o estado de todos os NPCs para o frontend
        pass

    def run_thought_cycle(self, npc_id: str, world_context: Dict):
        # Função chave:
        # 1. Pega o estado atual do NPC.
        # 2. Constrói o "Super Prompt" com base no estado e no contexto do mundo.
        # 3. Envia para o OLLAMA.
        # 4. Recebe a resposta (novo objetivo, mudança de humor, etc).
        # 5. Atualiza o objeto NPCState com a nova informação.
        pass

    def process_interaction(self, npc_id: str, player_interaction: Dict) -> Dict:
        # Semelhante ao ciclo de pensamento, mas focado em diálogo e interação.
        # Retorna a ação e o diálogo gerados.
        pass
```

### 3.5. Endpoints da API (`app.py`)

```python
# app.py
from flask import Flask, request, jsonify
from npc_manager import NPCManager

app = Flask(__name__)
manager = NPCManager()

@app.route('/api/npcs/state', methods=['GET'])
def get_all_npc_states():
    """Retorna o estado atual de todos os NPCs para o frontend."""
    return jsonify(manager.get_all_states())

@app.route('/api/npc/interact', methods=['POST'])
def interact_with_npc():
    """Processa uma interação do jogador com um NPC."""
    data = request.json # { "npc_id": "npc_01", "player_dialogue": "Olá!" }
    response = manager.process_interaction(data['npc_id'], data)
    return jsonify(response)

# Opcional: Endpoint para forçar um ciclo de pensamento
@app.route('/api/npc/think', methods=['POST'])
def trigger_thought_cycle():
    """Aciona um ciclo de pensamento para um NPC específico."""
    data = request.json # { "npc_id": "npc_01", "world_context": {...} }
    manager.run_thought_cycle(data['npc_id'], data['world_context'])
    return jsonify({"status": "thought cycle complete"})
```

-----

## 4\. O Frontend: `pecuariapro2-frontend`

### 4.1. Objetivo

  - Renderizar o mundo do jogo **PECUARIAPRO2** e os 20 NPCs.
  - Buscar e manter sincronizado o estado dos NPCs com o backend.
  - Permitir que o jogador clique em um NPC para iniciar uma interação.
  - Enviar as interações do jogador para a API do backend e exibir a resposta (diálogo) na UI.

### 4.2. Ferramentas

  - **Framework:** React
  - **Build Tool:** Vite
  - **Comunicação HTTP:** Axios
  - **Gerenciamento de Estado:** Zustand (recomendado pela simplicidade) ou Redux.

### 4.3. Fluxo de Interação do Jogo

1.  **Inicialização:** O `GameWorld.jsx` é montado. Ele usa o `useNPCStore` para buscar o estado inicial de todos os 20 NPCs via `GET /api/npcs/state`.
2.  **Loop do Jogo:** Um loop (`setInterval`) roda a cada X segundos:
    a. Busca novamente o estado dos NPCs para manter a sincronia.
    b. O `useNPCStore` atualiza o estado.
    c. Os componentes `NPC.jsx` re-renderizam com as novas posições, ações e diálogos.
3.  **Interação do Jogador:**
    a. O jogador clica em um `NPC.jsx`.
    b. A função de `onClick` do componente é chamada.
    c. A função chama o `npcService.js` para enviar uma requisição `POST /api/npc/interact` com o ID do NPC e a ação/diálogo do jogador.
    d. O `await` da chamada retorna a resposta do NPC (ação e diálogo).
    e. O estado do NPC específico é atualizado na store, causando uma re-renderização imediata da caixa de diálogo.

-----

## 5\. O Cérebro Generativo: O "Super Prompt"

Esta é a estrutura de prompt a ser enviada para o OLLAMA pelo backend. É a peça mais crítica para a cognição dos NPCs em **PECUARIAPRO2**.

```text
Você é um motor de cognição para um NPC em um jogo de fazenda chamado PECUARIAPRO2. Sua tarefa é interpretar o estado interno de um NPC e o contexto do mundo para determinar sua próxima ação, diálogo ou mudança de estado interno. Responda APENAS com um objeto JSON válido.

### ESTADO INTERNO DO NPC ###
{
  "id": "${npc.id}",
  "name": "${npc.name}",
  "personality": ${json.dumps(npc.personality)},
  "current_mood": "${npc.mood}",
  "physical_state": ${json.dumps(npc.physical_state)},
  "current_focus": ${json.dumps(npc.current_focus)},
  "long_term_goals": ${json.dumps(npc.long_term_goals)},
  "memories": ${json.dumps(npc.memories[-5:])}, // Apenas as 5 memórias mais recentes para economizar tokens
  "relationships": ${json.dumps(npc.relationships)}
}

### CONTEXTO DO MUNDO ATUAL ###
{
  "time_of_day": "Manhã",
  "weather": "Ensolarado",
  "season": "Primavera",
  "world_events": ["O festival da colheita será amanhã."]
}

### TAREFA ###
${task_description}

### FORMATO DE SAÍDA ###
Responda APENAS com um objeto JSON. O formato DEVE ser:
{
  "thought": "Uma breve descrição do processo de pensamento do NPC.",
  "new_mood": "O novo estado de humor do NPC (se mudar).",
  "new_short_term_goal": "Um novo objetivo de curto prazo (se aplicável).",
  "action": {
    "type": "TIPO_DA_ACAO", // Ex: GOTO, WORK, TALK, IDLE
    "target": "ALVO_DA_ACAO" // Ex: "casa", "plantacao_de_milho", "player"
  },
  "dialogue": "A linha de diálogo a ser dita (se houver)."
}
```

A variável `${task_description}` será preenchida pelo backend dependendo do que acionou a chamada:

  - **Para ciclo de pensamento:** "Com base em seu estado e no contexto, decida o que fazer a seguir."
  - **Para interação:** "O jogador disse: '${player\_dialogue}'. Com base em seu estado, memórias e no que ele disse, formule sua resposta e ação."

-----

## 6\. Checklist de Implementação para o Cursor AI

  - [ ] **Backend:** Criar a estrutura de pastas e arquivos (`pecuariapro2-backend`).
  - [ ] **Backend:** Implementar a classe `NPCState` em `npc_state.py` conforme a especificação.
  - [ ] **Backend:** Implementar a classe `NPCManager` em `npc_manager.py`. Inicialmente, popular com 2-3 NPCs para teste.
  - [ ] **Backend:** Criar os endpoints do Flask em `app.py`, conectando-os ao `NPCManager`.
  - [ ] **Backend:** Implementar a lógica de chamada ao OLLAMA dentro do `NPCManager`, usando o template do "Super Prompt".
  - [ ] **Frontend:** Criar a estrutura de pastas e arquivos (`pecuariapro2-frontend`).
  - [ ] **Frontend:** Configurar o `axios` e criar o `npcService.js` com as funções para chamar a API.
  - [ ] **Frontend:** Implementar uma store simples com Zustand em `useNPCStore.js`.
  - [ ] **Frontend:** Criar o componente `NPC.jsx` que renderiza um NPC com base nos dados da store.
  - [ ] **Frontend:** Criar o `GameWorld.jsx` para orquestrar a busca de dados e a renderização dos NPCs.
  - [ ] **Integração:** Testar o fluxo completo: carregar o jogo, ver os NPCs, clicar em um, enviar uma mensagem e receber a resposta do Llama 3.
  - [ ] **Persistência:** Implementar a lógica de salvar/carregar o estado dos NPCs do `npcs_save.json` no `NPCManager`.