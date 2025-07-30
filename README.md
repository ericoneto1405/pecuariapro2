# ...existing code...

## Padrão de Tempo do Jogo (Backend)

- Todos os endpoints e lógicas do backend devem utilizar o tempo do jogo, nunca o tempo real do sistema.
- Utilize sempre a função utilitária `get_game_date()` disponível em `services/utils/game_time.py` para obter a data do jogo baseada no estado persistente (`game_time.json`).
- Exemplo de uso em qualquer endpoint:

```python
from services.utils.game_time import get_game_date

data_jogo = get_game_date()
```
- As respostas dos endpoints devem incluir o campo `data_jogo` sempre que relevante.
- Novos endpoints devem seguir esse padrão obrigatoriamente.
- Revisões de código devem garantir o uso desse padrão.

# ...existing code...