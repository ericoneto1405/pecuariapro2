# Novo ponto de entrada do backend na raiz do projeto
import sys
import os

# Adiciona o diretório do backend ao sys.path para permitir imports relativos

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'pecuariapro2-backend'))
from main import app

if __name__ == '__main__':
    app.run(debug=True, port=5050)
