# Copilot Instructions for PECUÁRIAPRO2

## Visão Geral da Arquitetura
- O projeto é dividido em dois principais diretórios: `frontend/` (React + Vite) e `pecuariapro2-backend/` (Flask/Python).
- O frontend consome dados do backend via serviços API localizados em `frontend/src/api/`.
- O backend expõe endpoints REST para entidades como fazendas, NPCs e financeiro, organizados em blueprints (ex: `financeiro_api.py`).
- Dados persistentes e mocks ficam em `pecuariapro2-backend/state/` (ex: `npcs_save.json`, `npcs_state.json`).

## Fluxos de Desenvolvimento
- Para rodar o frontend: `cd frontend && npm install && npm run dev` (Vite).
- Para rodar o backend: `cd pecuariapro2-backend && pip install -r requirements.txt && python app.py`.
- O frontend espera o backend rodando em `localhost:5000` (ajuste URLs em `api/` se necessário).
- Não há testes automatizados configurados por padrão.

## Convenções e Padrões Específicos
- **Serviços de API**: Cada entidade relevante tem um arquivo de serviço em `frontend/src/api/` (ex: `npcService.js`, `financeiroService.js`). Use sempre esses serviços para integração.
- **Estado Global**: Use Zustand para estado de NPCs (`frontend/src/state/useNPCStore.js`).
- **Dados Mockados**: Dados mockados podem ser substituídos por dados do backend sem alterar layout ou lógica de exibição.
- **Componentização**: Componentes de página ficam em `frontend/src/pages/`, componentes reutilizáveis em `frontend/src/components/`.
- **Documentação**: Documentos de domínio e PRD estão em `docs/`.

## Integrações e Comunicação
- O backend Flask utiliza blueprints para modularizar APIs (ex: `financeiro_api`).
- O frontend consome endpoints via fetch/axios encapsulados nos serviços de API.
- Dados de NPCs e fazendas são persistidos em JSON no backend e expostos via endpoints.

## Exemplos de Arquivos-Chave
- `frontend/src/pages/Financeiro.jsx`: Exemplo de integração de dados backend sem alterar layout.
- `frontend/src/api/financeiroService.js`: Exemplo de serviço API para consumo de endpoints Flask.
- `pecuariapro2-backend/financeiro_api.py`: Exemplo de blueprint Flask para endpoints financeiros.
- `pecuariapro2-backend/state/npcs_save.json`: Exemplo de estrutura de dados persistente para NPCs.

## Observações Importantes
- **Nunca altere o layout ou lógica de exibição sem autorização explícita.**
- Sempre prefira integração via serviços de API já existentes.
- Consulte os arquivos em `docs/` para entender regras de negócio e contexto de simulação.

---

Seções ou padrões não documentados aqui podem ser detalhados sob demanda. Consulte este arquivo antes de propor novas integrações ou refatorações.
