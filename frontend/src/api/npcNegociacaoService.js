import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

// Enviar proposta de negociação para um NPC
export const enviarPropostaNPC = async (proposta) => {
  try {
    const response = await axios.post(`${API_URL}/npcs/proposta`, proposta);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar proposta:', error);
    throw error;
  }
};

// Buscar histórico de propostas com um NPC específico
export const buscarHistoricoPropostas = async (npcId) => {
  try {
    const response = await axios.get(`${API_URL}/npcs/${npcId}/propostas`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
};

// Buscar todas as propostas pendentes
export const buscarPropostasPendentes = async () => {
  try {
    const response = await axios.get(`${API_URL}/npcs/propostas/pendentes`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar propostas pendentes:', error);
    throw error;
  }
};

// Aceitar proposta de um NPC
export const aceitarProposta = async (propostaId) => {
  try {
    const response = await axios.post(`${API_URL}/npcs/propostas/${propostaId}/aceitar`);
    return response.data;
  } catch (error) {
    console.error('Erro ao aceitar proposta:', error);
    throw error;
  }
};

// Rejeitar proposta de um NPC
export const rejeitarProposta = async (propostaId) => {
  try {
    const response = await axios.post(`${API_URL}/npcs/propostas/${propostaId}/rejeitar`);
    return response.data;
  } catch (error) {
    console.error('Erro ao rejeitar proposta:', error);
    throw error;
  }
};

// Simular resposta de um NPC (para desenvolvimento)
export const simularRespostaNPC = async (npcId, tipoProposta) => {
  // Simulação de diferentes personalidades de NPC
  const respostas = {
    tradicionalista: [
      "Hmm, essa proposta me faz pensar... Preciso conversar com minha família primeiro.",
      "Não sei se é o momento certo para isso. Vamos deixar para depois?",
      "Interessante, mas preciso de mais garantias antes de fechar o negócio.",
      "Essa proposta me interessa! Mas posso fazer uma contraproposta?"
    ],
    inovador: [
      "Excelente proposta! Vamos fechar o negócio agora mesmo!",
      "Interessante abordagem! Posso sugerir algumas melhorias?",
      "Essa proposta está alinhada com meus objetivos. Vamos negociar!",
      "Gostei da ideia! Vamos fazer um teste piloto primeiro?"
    ],
    politico: [
      "Essa proposta pode ser interessante para a comunidade. Vamos analisar os benefícios.",
      "Preciso consultar meus aliados antes de tomar uma decisão.",
      "Essa negociação pode abrir portas para futuras parcerias. Vamos conversar mais.",
      "Interessante proposta! Posso incluir alguns benefícios para a região?"
    ]
  };

  // Simular delay de resposta
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Retornar resposta baseada na personalidade do NPC
  const personalidade = Math.random() > 0.5 ? 'tradicionalista' : 
                       Math.random() > 0.5 ? 'inovador' : 'politico';
  
  const respostasDisponiveis = respostas[personalidade];
  const respostaAleatoria = respostasDisponiveis[Math.floor(Math.random() * respostasDisponiveis.length)];

  return {
    sucesso: Math.random() > 0.3, // 70% de chance de sucesso
    resposta: respostaAleatoria,
    contraproposta: Math.random() > 0.7 ? {
      preco: Math.floor(Math.random() * 1000) + 500,
      condicoes: "Algumas condições especiais que preciso"
    } : null,
    tempoResposta: Math.floor(Math.random() * 48) + 1 // 1-48 horas
  };
}; 