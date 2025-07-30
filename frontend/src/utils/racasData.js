// Base de dados das principais raças bovinas para o motor genético
// Cada raça tem genótipos padrão para Extension, Diluição e Polled
// O símbolo '_' indica alelo aleatório (dominante ou recessivo)

export const racasData = {
  'Angus Preto': {
    nome: 'Angus Preto',
    subespecie: 'Bos taurus',
    genotipo: {
      extension: ['E^D', '_'], // Alelo 2 pode ser E^D ou e
      diluicao: ['d', 'd'],
      polled: ['P', 'P']
    }
  },
  'Angus Vermelho': {
    nome: 'Angus Vermelho',
    subespecie: 'Bos taurus',
    genotipo: {
      extension: ['e', 'e'],
      diluicao: ['d', 'd'],
      polled: ['P', 'P']
    }
  },
  'Hereford Mocho': {
    nome: 'Hereford Mocho',
    subespecie: 'Bos taurus',
    genotipo: {
      extension: ['e', 'e'],
      diluicao: ['d', 'd'],
      polled: ['P', '_'] // Pode ser P ou p
    }
  },
  'Hereford Aspado': {
    nome: 'Hereford Aspado',
    subespecie: 'Bos taurus',
    genotipo: {
      extension: ['e', 'e'],
      diluicao: ['d', 'd'],
      polled: ['p', 'p']
    }
  },
  'Charolês Mocho': {
    nome: 'Charolês Mocho',
    subespecie: 'Bos taurus',
    genotipo: {
      extension: ['e', 'e'],
      diluicao: ['D', '_'], // Pode ser D ou d
      polled: ['P', '_']
    }
  },
  'Charolês Aspado': {
    nome: 'Charolês Aspado',
    subespecie: 'Bos taurus',
    genotipo: {
      extension: ['e', 'e'],
      diluicao: ['D', '_'],
      polled: ['p', 'p']
    }
  },
  'Nelore Mocho': {
    nome: 'Nelore Mocho',
    subespecie: 'Bos indicus',
    genotipo: {
      extension: ['e', 'e'],
      diluicao: ['d', 'd'],
      polled: ['P', '_']
    }
  },
  'Nelore Padrão': {
    nome: 'Nelore Padrão',
    subespecie: 'Bos indicus',
    genotipo: {
      extension: ['e', 'e'],
      diluicao: ['d', 'd'],
      polled: ['p', 'p']
    }
  },
  'Senepol': {
    nome: 'Senepol',
    subespecie: 'Bos taurus',
    genotipo: {
      extension: ['e', 'e'],
      diluicao: ['d', 'd'],
      polled: ['P', 'P']
    }
  }
};

// Função utilitária para sortear alelo aleatório quando '_' está presente
export function sortearAleloDominanciaDominanteDominanteRecessivo(alelos, dominantes, recessivos) {
  return alelos.map(a => {
    if (a === '_') {
      // Sorteia entre dominante e recessivo
      return Math.random() < 0.5 ? dominantes : recessivos;
    }
    return a;
  });
}
