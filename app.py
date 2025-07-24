# SOLUÇÃO 1: Configurar CORS no Backend (Python/Flask)
# Se você está usando Flask no backend

from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)

# CONFIGURAÇÃO CORS - Permite comunicação entre frontend e backend
CORS(app, origins=[
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # React dev server alternativo
    "http://127.0.0.1:5173",  # Alternativa local
    "http://127.0.0.1:3000"   # Alternativa local
])

# Ou configuração mais específica para produção:
# CORS(app, 
#     origins=["http://localhost:5173"],
#     methods=["GET", "POST", "PUT", "DELETE"],
#     allow_headers=["Content-Type", "Authorization"]
# )

@app.route('/api/advance_time', methods=['POST', 'OPTIONS'])
def advance_time():
    """
    Endpoint para avançar tempo do jogo
    OPTIONS é necessário para CORS preflight
    """
    
    # Handle preflight request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        # Recebe dados do frontend
        data = request.get_json()
        
        # Processa o avanço do tempo
        # (substitua pela sua lógica do jogo)
        current_time = data.get('currentTime', 0)
        advance_by = data.get('advanceBy', 1)
        
        new_time = current_time + advance_by
        
        # Simula eventos do jogo baseados no tempo
        events = []
        if new_time % 7 == 0:  # Evento semanal
            events.append({
                "type": "weekly_report",
                "message": "Relatório semanal do rebanho disponível"
            })
        
        if new_time % 30 == 0:  # Evento mensal
            events.append({
                "type": "monthly_market",
                "message": "Preços do mercado atualizados"
            })
        
        response_data = {
            "success": True,
            "newTime": new_time,
            "events": events,
            "gameState": {
                "day": new_time % 30 + 1,
                "month": (new_time // 30) % 12 + 1,
                "year": new_time // 365 + 1
            }
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/game_status', methods=['GET'])
def game_status():
    """Endpoint para verificar status do jogo"""
    return jsonify({
        "status": "running",
        "server": "backend_pecuaria",
        "version": "1.0.0"
    })

if __name__ == '__main__':
    print("🐄 Servidor do jogo de pecuária iniciando...")
    print("🌐 CORS configurado para localhost:5173")
    app.run(
        host='127.0.0.1',  # ou '0.0.0.0' para aceitar de qualquer IP
        port=5000,
        debug=True
    )
