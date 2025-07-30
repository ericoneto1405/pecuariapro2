# Sistema Otimizado de Consumo de Pastagem - Jogo de Simulação

## Contexto do Projeto
Jogo de simulação de fazendas em React com fazendas em biomas brasileiros e dados climáticos em tempo real.

## Analogia Refinada
**Pastagem = Sistema de Energia Renovável (Solar/Eólica):**
- **Capacidade instalada** (potencial máximo UA/ha)
- **Geração atual** (crescimento diário baseado no clima)
- **Consumo** (demanda do rebanho)
- **Armazenamento** (reserva de biomassa acumulada)
- **Eficiência** varia por tecnologia (tipo de pastagem) e condições ambientais
- **Degradação** por uso inadequado ou condições extremas

## Especificações Técnicas

### 1. Estrutura Otimizada de Dados
```javascript
const pastagem = {
  // Identificação
  id: "pastagem_001",
  fazenda_id: "fazenda_123",
  tipo: "Capim_Piatã",
  bioma: "Cerrado",
  
  // Capacidade e Estado Atual
  capacidade_maxima_ua: 1000,    // Unidades Animais por hectare
  biomassa_atual_kg: 2500,       // kg de matéria seca/ha
  biomassa_maxima_kg: 4000,      // capacidade máxima
  
  // Qualidade Nutricional
  proteina_bruta: 12.5,          // % (varia 8-18%)
  digestibilidade: 65,           // % (varia 45-75%)
  energia_metabolica: 2.1,       // Mcal/kg
  
  // Características Genéticas da Pastagem
  resistencias: {
    seca: 8,           // 0-10 (Piatã é muito resistente)
    encharcamento: 4,  // 0-10
    geada: 6,          // 0-10
    salinidade: 3,     // 0-10
    acidez: 7          // 0-10
  },
  
  // Estado Dinâmico
  taxa_crescimento_atual: 2.1,   // kg MS/ha/dia
  pressao_pastejo: 0.75,         // 0-1 (% da capacidade ocupada)
  dias_sem_chuva: 5,
  ciclo_vida: "vegetativo",      // "vegetativo", "reprodutivo", "senescencia"
  
  // Cache de Performance
  ultimo_calculo: timestamp,
  proxima_atualizacao: timestamp,
  historico_7dias: [] // para suavizar variações bruscas
}
```

### 2. Sistema de Consumo Otimizado
```javascript
// Pool de cálculos reutilizáveis
const CalculadoraPastagem = {
  cache: new Map(),
  
  calcularConsumoRebanho(rebanho, pastagem) {
    const cacheKey = `consumo_${rebanho.id}_${Date.now() - (Date.now() % 3600000)}`; // Cache por hora
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const consumoTotal = rebanho.animais.reduce((total, animal) => {
      // Consumo base: 2.5% do peso vivo em matéria seca
      let consumoDiario = animal.peso * 0.025;
      
      // Fatores de ajuste otimizados
      const fatores = {
        idade: animal.idade < 12 ? 1.15 : (animal.idade > 84 ? 0.95 : 1.0),
        lactacao: animal.lactando ? 1.4 : 1.0,
        gestacao: animal.gestante ? 1.2 : 1.0,
        qualidade_pastagem: this.fatorQualidadePastagem(pastagem),
        estresse_termico: this.calcularEstresseTermico(animal, pastagem.clima)
      };
      
      return total + (consumoDiario * Object.values(fatores).reduce((a, b) => a * b, 1));
    }, 0);
    
    this.cache.set(cacheKey, consumoTotal);
    return consumoTotal;
  },
  
  // Otimização: cálculo de estresse térmico simplificado mas realista
  calcularEstresseTermico(animal, clima) {
    const ITU = 0.8 * clima.temperatura + (clima.umidade / 100) * (clima.temperatura - 14.4) + 46.4;
    
    if (ITU < 72) return 1.0;        // Conforto
    if (ITU < 79) return 1.1;        // Estresse leve
    if (ITU < 89) return 1.25;       // Estresse moderado
    return 1.4;                      // Estresse severo
  }
};
```

### 3. Motor de Crescimento Inteligente
```javascript
class MotorCrescimentoPastagem {
  constructor() {
    this.processQueue = [];
    this.isProcessing = false;
    this.updateInterval = null;
  }
  
  // Batch processing para múltiplas fazendas
  adicionarFazenda(fazenda) {
    this.processQueue.push({
      id: fazenda.id,
      pastagem: fazenda.pastagem,
      clima: fazenda.clima,
      prioridade: fazenda.status === 'crítica' ? 1 : 2
    });
  }
  
  async processarLote() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    // Ordena por prioridade (críticas primeiro)
    this.processQueue.sort((a, b) => a.prioridade - b.prioridade);
    
    const promises = this.processQueue.map(item => 
      this.calcularCrescimentoOtimizado(item.pastagem, item.clima)
    );
    
    await Promise.all(promises);
    this.processQueue = [];
    this.isProcessing = false;
  }
  
  calcularCrescimentoOtimizado(pastagem, clima) {
    // Modelo de crescimento baseado em Gompertz (curva S)
    const taxaBase = this.getTaxaBasePorTipo(pastagem.tipo);
    const capacidadeAtual = pastagem.biomassa_atual_kg / pastagem.biomassa_maxima_kg;
    
    // Fator de crescimento logístico
    const fatorCapacidade = Math.exp(-3 * capacidadeAtual);
    
    // Fatores climáticos otimizados por lookup table
    const fatorClimatico = this.getFatorClimatico(pastagem.tipo, clima);
    
    // Fator estacional pré-calculado
    const fatorEstacional = this.getFatorEstacional(pastagem.bioma, new Date().getMonth());
    
    const crescimentoDiario = taxaBase * fatorCapacidade * fatorClimatico * fatorEstacional;
    
    // Aplicar crescimento com limites
    pastagem.biomassa_atual_kg = Math.min(
      pastagem.biomassa_maxima_kg,
      pastagem.biomassa_atual_kg + crescimentoDiario
    );
    
    return pastagem;
  }
  
  // Lookup tables para performance
  getFatorClimatico(tipoPastagem, clima) {
    const lookupTable = {
      'Capim_Piatã': {
        temp_otima: [25, 35],
        chuva_minima: 3,
        fator_seca: 0.3
      },
      'Capim_Humidicola': {
        temp_otima: [24, 32],
        chuva_minima: 5,
        fator_encharcamento: 1.2
      }
      // ... outros tipos
    };
    
    const config = lookupTable[tipoPastagem];
    let fator = 1.0;
    
    // Temperatura
    if (clima.temperatura < config.temp_otima[0] || clima.temperatura > config.temp_otima[1]) {
      fator *= 0.7;
    }
    
    // Chuva
    if (clima.chuva_mm >= config.chuva_minima) {
      fator *= 1.3;
    } else if (clima.chuva_mm === 0) {
      fator *= config.fator_seca || 0.4;
    }
    
    return Math.max(0.1, Math.min(2.0, fator));
  }
}
```

### 4. Integração com Dados Climáticos
Use os dados já existentes do `climas` no seu código:

```javascript
// Exemplo de como integrar com o clima atual
useEffect(() => {
  if (climas && fazendas.length > 0) {
    fazendas.forEach(fazenda => {
      const climaFazenda = climas[fazenda.id];
      if (climaFazenda) {
        atualizarPastagem(fazenda.id, climaFazenda);
      }
    });
  }
}, [climas, fazendas]);
```

## Regras de Negócio Específicas

### Por Bioma (baseado no documento Embrapa.md):

**Cerrado:**
- Capim Piatã: alta resistência à seca, cresce bem com chuva
- Capim Zuri: precisa solo fértil, sensível à seca prolongada

**Amazônia:**
- Capim Humidicola: cresce bem com alta umidade, resiste ao encharcamento
- Braquiarão + Amendoim: fixação de nitrogênio aumenta qualidade

**Pampa:**
- Campo nativo: resistente ao pisoteio, cresce no frio
- Aveia-preta: pastagem de inverno, ciclo sazonal

**Caatinga:**
- Capim Buffel: sobrevive à seca extrema, regenera rápido com chuva
- Gliricídia: fonte de proteína na seca

### Estados da Pastagem:
- **Excelente (90-100%)**: Crescimento máximo, gado ganha peso extra
- **Boa (70-89%)**: Condições normais
- **Regular (50-69%)**: Crescimento reduzido
- **Degradada (30-49%)**: Gado perde peso, precisa suplementação
- **Crítica (0-29%)**: Gado perde peso rapidamente, risco de morte

## Interface Visual
Implemente indicadores visuais similares aos do seu jogo:
- Barra de "saúde" da pastagem (como barra de HP em jogos)
- Ícones climáticos que já existem no código
- Cores: Verde (boa), Amarelo (regular), Vermelho (crítica)
- Animações sutis de crescimento/deterioração

## Implementação Técnica

### 4. Hook Otimizado com Throttling
```javascript
const usePastagem = (fazendaId, opcoes = {}) => {
  const [pastagem, setPastagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({});
  
  // Throttle para evitar cálculos excessivos
  const { throttleMs = 60000, enablePrediction = true } = opcoes;
  
  const motorCrescimento = useMemo(() => new MotorCrescimentoPastagem(), []);
  
  // Worker para cálculos pesados (se disponível)
  const worker = useMemo(() => {
    if (typeof Worker !== 'undefined') {
      return new Worker('/workers/pastagem-worker.js');
    }
    return null;
  }, []);
  
  const atualizarPastagem = useCallback(
    throttle(async (climaAtual) => {
      if (!pastagem) return;
      
      const dadosCalculo = {
        pastagem: pastagem,
        clima: climaAtual,
        rebanho: pastagem.rebanho_atual
      };
      
      // Usar Web Worker se disponível, senão processar no thread principal
      if (worker) {
        worker.postMessage({ type: 'CALCULAR_PASTAGEM', data: dadosCalculo });
        worker.onmessage = (e) => {
          if (e.data.type === 'PASTAGEM_CALCULADA') {
            setPastagem(e.data.result);
            setMetricas(e.data.metricas);
          }
        };
      } else {
        const resultado = await motorCrescimento.calcularCrescimentoOtimizado(
          pastagem, 
          climaAtual
        );
        setPastagem(resultado);
      }
    }, throttleMs),
    [pastagem, worker, motorCrescimento, throttleMs]
  );
  
  // Predição inteligente do estado futuro
  const preverEstado = useCallback((diasFuturos = 7) => {
    if (!enablePrediction || !pastagem) return null;
    
    const previsao = {
      dias: diasFuturos,
      biomassa_final: pastagem.biomassa_atual_kg,
      risco_superpastejo: false,
      acoes_recomendadas: []
    };
    
    // Simulação simplificada
    const consumoDiario = pastagem.rebanho_atual?.consumo_diario || 0;
    const crescimentoMedio = pastagem.taxa_crescimento_atual;
    
    for (let dia = 1; dia <= diasFuturos; dia++) {
      previsao.biomassa_final += crescimentoMedio - consumoDiario;
      
      if (previsao.biomassa_final < pastagem.biomassa_maxima_kg * 0.2) {
        previsao.risco_superpastejo = true;
        previsao.acoes_recomendadas.push('Reduzir lotação');
        break;
      }
    }
    
    return previsao;
  }, [pastagem, enablePrediction]);
  
  return {
    pastagem,
    loading,
    metricas,
    atualizarPastagem,
    preverEstado,
    // Helpers
    getStatus: () => {
      if (!pastagem) return 'loading';
      const percentual = pastagem.biomassa_atual_kg / pastagem.biomassa_maxima_kg;
      if (percentual > 0.8) return 'excelente';
      if (percentual > 0.6) return 'boa';
      if (percentual > 0.4) return 'regular';
      if (percentual > 0.2) return 'degradada';
      return 'crítica';
    },
    getCapacidadeUA: () => {
      return Math.floor((pastagem?.biomassa_atual_kg || 0) / 15); // 15kg MS/UA/dia
    }
  };
};
```

### 5. Componente de Interface Otimizado
```javascript
const PastagemMonitor = React.memo(({ fazendaId, compacto = false }) => {
  const { pastagem, loading, metricas, preverEstado, getStatus, getCapacidadeUA } = usePastagem(fazendaId, {
    throttleMs: compacto ? 120000 : 60000, // Menos updates em modo compacto
    enablePrediction: !compacto
  });
  
  const status = getStatus();
  const previsao = preverEstado(7);
  
  // Otimização: memo para cores que não mudam frequentemente
  const coresStatus = useMemo(() => ({
    excelente: '#4ade80',
    boa: '#22c55e',
    regular: '#eab308',
    degradada: '#f97316',
    crítica: '#ef4444'
  }), []);
  
  const IndicadorBiomassa = useMemo(() => (
    <div className="biomassa-indicator">
      <div 
        className="biomassa-bar"
        style={{
          width: `${(pastagem?.biomassa_atual_kg / pastagem?.biomassa_maxima_kg) * 100}%`,
          backgroundColor: coresStatus[status],
          transition: 'width 0.5s ease-in-out'
        }}
      />
      <span className="biomassa-text">
        {pastagem?.biomassa_atual_kg.toFixed(0)} / {pastagem?.biomassa_maxima_kg} kg MS/ha
      </span>
    </div>
  ), [pastagem, status, coresStatus]);
  
  if (loading) return <div className="pastagem-loading">Analisando pastagem...</div>;
  
  return (
    <div className={`pastagem-monitor ${compacto ? 'compacto' : 'detalhado'}`}>
      <div className="status-header">
        <h4>{pastagem.tipo.replace('_', ' ')}</h4>
        <span className={`status-badge ${status}`}>{status.toUpperCase()}</span>
      </div>
      
      {IndicadorBiomassa}
      
      <div className="metricas-grid">
        <div className="metrica">
          <span className="label">Capacidade UA</span>
          <span className="valor">{getCapacidadeUA()}</span>
        </div>
        <div className="metrica">
          <span className="label">Proteína</span>
          <span className="valor">{pastagem.proteina_bruta.toFixed(1)}%</span>
        </div>
        {!compacto && (
          <>
            <div className="metrica">
              <span className="label">Crescimento</span>
              <span className="valor">{pastagem.taxa_crescimento_atual.toFixed(1)} kg/dia</span>
            </div>
            <div className="metrica">
              <span className="label">Pressão Pastejo</span>
              <span className="valor">{(pastagem.pressao_pastejo * 100).toFixed(0)}%</span>
            </div>
          </>
        )}
      </div>
      
      {previsao && previsao.risco_superpastejo && (
        <div className="alerta-risco">
          ⚠️ Risco de superpastejo em {previsao.dias} dias
          <div className="acoes-recomendadas">
            {previsao.acoes_recomendadas.map((acao, i) => (
              <button key={i} className="acao-btn">{acao}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
```

## Otimizações de Performance Implementadas

### 1. **Processamento Assíncrono e Batch**
- Queue para processar múltiplas fazendas em lotes
- Priorização de fazendas em estado crítico
- Web Workers para cálculos pesados sem travar a UI

### 2. **Sistema de Cache Inteligente**
- Cache por hora para cálculos de consumo
- Lookup tables para fatores climáticos
- Throttling de atualizações (1-2 minutos)
- Memoização de componentes React

### 3. **Algoritmos Otimizados**
- Modelo de crescimento Gompertz (mais realista que linear)
- Cálculo de ITU (Índice de Temperatura e Umidade) simplificado
- Fatores sazonais pré-calculados por bioma

### 4. **Gestão de Estado Eficiente**
- useState com lazy initialization
- useCallback e useMemo estratégicos
- Atualizações condicionais baseadas em mudanças significativas

### 5. **Interface Responsiva**
- Modo compacto vs detalhado
- Indicadores visuais suaves (CSS transitions)
- Componentes memorizados para evitar re-renders

## Configuração de Workers (opcional)
```javascript
// public/workers/pastagem-worker.js
self.onmessage = function(e) {
  if (e.data.type === 'CALCULAR_PASTAGEM') {
    const { pastagem, clima, rebanho } = e.data.data;
    
    // Cálculos pesados aqui
    const resultado = calcularCrescimentoCompleto(pastagem, clima, rebanho);
    const metricas = gerarMetricas(resultado);
    
    self.postMessage({
      type: 'PASTAGEM_CALCULADA',
      result: resultado,
      metricas: metricas
    });
  }
};
```

## Dados de Exemplo para Teste
```javascript
const exemploPastagens = {
  "Cerrado": {
    "Capim_Piatã": { resistencia_seca: 9, crescimento_chuva: 1.5 },
    "Capim_Zuri": { resistencia_seca: 6, crescimento_chuva: 2.0 }
  },
  "Amazônia": {
    "Capim_Humidicola": { resistencia_encharcamento: 9, crescimento_umidade: 1.3 }
  }
  // ... outros biomas
}
```

## Mecânicas de Gameplay
1. **Planejamento Estratégico**: Jogador deve escolher pastagens adequadas ao bioma
2. **Gestão de Recursos**: Balancear número de animais vs capacidade da pastagem
3. **Sazonalidade**: Adaptar estratégias conforme épocas de chuva/seca
4. **Investimentos**: Opções de melhorar pastagem, irrigação, suplementação
5. **Consequências Realistas**: Superlotação leva à degradação e perda de produtividade

## Considerações para /macOS
- Use Core Animation para transições suaves
- Implemente notificações push para alertas críticos
- Considere modo offline com sincronização posterior

**Objetivo Final:** Criar um sistema que simule realisticamente o manejo de pastagens, educando o jogador sobre pecuária sustentável enquanto oferece gameplay engajante e desafiador.