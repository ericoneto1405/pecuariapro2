// competicaoService.js - Serviço para API de Competição

const BASE_URL = 'http://localhost:5050';

// Função auxiliar para fazer requisições
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

// Serviços de Competição
export const competicaoService = {
  // Listar todos os juízes
  listarJuizes: async () => {
    return apiRequest('/api/competicao/juizes');
  },

  // Obter juiz especialista por raça
  obterJuizEspecialista: async (raca) => {
    return apiRequest(`/api/competicao/juiz/${raca}`);
  },

  // Listar categorias disponíveis
  listarCategorias: async () => {
    return apiRequest('/api/competicao/categorias');
  },

  // Listar raças disponíveis
  listarRacas: async () => {
    return apiRequest('/api/competicao/racas');
  },

  // Avaliar um animal individual
  avaliarAnimal: async (animalId, raca) => {
    return apiRequest('/api/competicao/avaliar_animal', {
      method: 'POST',
      body: JSON.stringify({ animal_id: animalId, raca }),
    });
  },

  // Julgar uma competição completa
  julgarCompeticao: async (raca, categoria, animaisInscritos) => {
    return apiRequest('/api/competicao/julgar', {
      method: 'POST',
      body: JSON.stringify({
        raca,
        categoria,
        animais_inscritos: animaisInscritos,
      }),
    });
  },

  // Obter estado dos NPCs (para buscar animais)
  obterEstadoNPCs: async () => {
    return apiRequest('/api/npcs/state');
  },

  // Obter catálogo de sêmen (para referência)
  obterCatalogoSemen: async () => {
    return apiRequest('/api/catalog/semen');
  },
};

// Serviços auxiliares para dados do jogo
export const gameDataService = {
  // Obter animais do jogador (mockado por enquanto)
  obterMeusAnimais: async () => {
    // Simular dados do jogador - em produção viria do backend
    return [
      { 
        animalId: 'VABE0001', 
        raca: 'Nelore', 
        categoria: 'Fêmea Jovem',
        nome: 'Estrela do Vale',
        idade: '18 meses',
        valor: 8500,
        owner_id: 'player'
      },
      { 
        animalId: 'VABE0002', 
        raca: 'Nelore', 
        categoria: 'Macho Jovem',
        nome: 'Touro do Sertão',
        idade: '24 meses',
        valor: 12000,
        owner_id: 'player'
      },
      { 
        animalId: 'ANGU0003', 
        raca: 'Angus', 
        categoria: 'Fêmea Adulta',
        nome: 'Rainha Negra',
        idade: '36 meses',
        valor: 18000,
        owner_id: 'player'
      },
      { 
        animalId: 'ANGU0004', 
        raca: 'Angus', 
        categoria: 'Macho Sênior',
        nome: 'Rei do Marmoreio',
        idade: '48 meses',
        valor: 25000,
        owner_id: 'player'
      },
      { 
        animalId: 'HERF0005', 
        raca: 'Hereford', 
        categoria: 'Fêmea Jovem',
        nome: 'Flor do Pampa',
        idade: '20 meses',
        valor: 9500,
        owner_id: 'player'
      },
      { 
        animalId: 'HERF0006', 
        raca: 'Hereford', 
        categoria: 'Macho Jovem',
        nome: 'Campeão Vermelho',
        idade: '22 meses',
        valor: 11000,
        owner_id: 'player'
      }
    ];
  },

  // Obter calendário de eventos (mockado por enquanto)
  obterCalendarioEventos: async () => {
    return [
      { 
        id: 'EVT01', 
        nome: '1ª Etapa - Circuito Vale do Ouro', 
        data: 'Março', 
        racas: ['Nelore'],
        local: 'Fazenda São João, MG',
        premio: 'R$ 15.000',
        descricao: 'Competição tradicional focada na rusticidade e funcionalidade do Nelore.'
      },
      { 
        id: 'EVT02', 
        nome: '2ª Etapa - ExpoAngus Prime', 
        data: 'Maio', 
        racas: ['Angus'],
        local: 'Centro de Eventos, RS',
        premio: 'R$ 25.000',
        descricao: 'Evento premium para animais de alto padrão genético e marmoreio.'
      },
      { 
        id: 'EVT03', 
        nome: '3ª Etapa - Feira Hereford do Pampa', 
        data: 'Julho', 
        racas: ['Hereford'],
        local: 'Pampa Gaúcho, RS',
        premio: 'R$ 18.000',
        descricao: 'Competição que valoriza a tradição e adaptabilidade do Hereford.'
      },
      { 
        id: 'EVT04', 
        nome: '4ª Etapa - ExpoZebu Master', 
        data: 'Setembro', 
        racas: ['Nelore', 'Hereford'],
        local: 'Centro de Exposições, SP',
        premio: 'R$ 30.000',
        descricao: 'Grande evento que reúne as melhores raças zebuínas do país.'
      },
      { 
        id: 'EVT05', 
        nome: '5ª Etapa - Copa Genética Taurina', 
        data: 'Novembro', 
        racas: ['Angus', 'Hereford'],
        local: 'Fazenda Modelo, PR',
        premio: 'R$ 35.000',
        descricao: 'Competição de elite para raças taurinas de alto padrão.'
      },
      { 
        id: 'EVT06', 
        nome: 'Finalíssima - Grande Campeão do Ano', 
        data: 'Dezembro', 
        racas: ['Nelore', 'Angus', 'Hereford'],
        local: 'Centro de Eventos Nacional, DF',
        premio: 'R$ 100.000',
        descricao: 'A maior competição do ano, reunindo os melhores animais de todas as raças.'
      }
    ];
  },
};

// Função para verificar se o backend está online
export const verificarBackendOnline = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/competicao/juizes`);
    return response.ok;
  } catch (error) {
    console.warn('Backend não está disponível:', error);
    return false;
  }
};

// Função para obter animais dos NPCs (para competições)
export const obterAnimaisNPCs = async () => {
  try {
    const response = await apiRequest('/api/npcs/state');
    const animais = [];
    
    // Extrair animais de todos os NPCs
    Object.values(response).forEach(npc => {
      if (npc.inventory) {
        npc.inventory.forEach(animal => {
          animais.push({
            ...animal,
            owner_id: npc.id || 'npc',
            owner_nome: npc.nome || 'NPC'
          });
        });
      }
    });
    
    return animais;
  } catch (error) {
    console.error('Erro ao obter animais dos NPCs:', error);
    return [];
  }
};

export default competicaoService; 