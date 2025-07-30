# 🐄 Sistema Meus Rebanhos - Interface Hierárquica e Interativa

## 📋 Visão Geral

Implementamos uma tela central de gerenciamento "Meus Rebanhos" que vai além de uma simples lista, criando uma interface hierárquica e interativa que permite ao jogador visualizar e gerenciar seus animais distribuídos por fazendas e pastos.

## 🚀 Principais Funcionalidades Implementadas

### 1. **Estrutura de Dados Hierárquica** ✅
- **Fazendas**: Cada fazenda contém múltiplos pastos
- **Pastos**: Cada pasto tem capacidade definida em UA (Unidade Animal)
- **Animais**: Cada animal tem localização específica (pastoId)
- **Distribuição Inteligente**: Animais distribuídos automaticamente por tipo

### 2. **Interface Visual Hierárquica** ✅
- **Accordion de Fazendas**: Painéis expansíveis para cada fazenda
- **Mini-Dashboards**: Estatísticas em tempo real para fazendas e pastos
- **Cards Interativos**: Pastos como cards clicáveis com informações detalhadas
- **Lista de Animais**: Visualização detalhada dos animais em cada pasto

### 3. **Sistema Drag-and-Drop** ✅
- **Arrastar Animais**: Mover animais entre pastos
- **Validação de Capacidade**: Verificar se o pasto de destino tem espaço
- **Feedback Visual**: Indicadores visuais durante o drag
- **Atualização em Tempo Real**: Dashboards atualizados instantaneamente

## 🎯 Estrutura de Dados Implementada

### **Backend - Script de Atualização**
```python
# Estrutura de Fazenda
{
  "assetId": "fazenda_inicial_01",
  "name": "Fazenda Vale Verde",
  "size_hectares": 300,
  "pastos": [
    {
      "pastoId": "fazenda_inicial_01_pasto_01",
      "nome": "Pasto Maternidade",
      "capacidade_ua": 45,
      "area_ha": 45,
      "tipo": "maternidade"
    }
  ]
}

# Estrutura de Animal
{
  "animalId": "NELO1001",
  "localizacao": "fazenda_inicial_01_pasto_01",
  "breed": "Nelore",
  "sex": "Macho",
  "baseValue": 0.95
}
```

### **Tipos de Pasto Gerados**
- **Pasto Maternidade**: Para fêmeas em reprodução
- **Pasto de Recria**: Para animais jovens
- **Pasto de Engorda**: Para animais em terminação
- **Pasto de Touros**: Para reprodutores
- **Pasto de Reserva**: Para rotação
- **Piquete de Manejo**: Para operações especiais

## 🎨 Interface Implementada

### **1. Header da Fazenda**
- **Nome da Fazenda**: Título principal
- **Total de Animais**: Contador em tempo real
- **Tamanho**: Área em hectares
- **Lotação Geral**: Percentual de ocupação com cores indicativas

### **2. Cards de Pasto**
- **Nome do Pasto**: Identificação clara
- **Lotação Atual vs. Capacidade**: Ex: "35/50 UA"
- **Percentual de Ocupação**: Com cores (Verde/Amarelo/Vermelho)
- **Resumo do Lote**: "1 Touro, 34 Fêmeas"

### **3. Lista de Animais**
- **Ícones por Raça**: Visual diferenciado por raça
- **Informações Detalhadas**: Nome, sexo, raça, valor genético
- **Indicador de Drag**: Ícone para arrastar
- **Estados Visuais**: Hover e drag states

## 🔧 Funcionalidades Técnicas

### **Cálculos Automáticos**
```javascript
// Estatísticas de Fazenda
const calcularEstatisticasFazenda = (fazenda) => {
  const animaisFazenda = dados.inventory.filter(animal => 
    fazenda.pastos.some(pasto => pasto.pastoId === animal.localizacao)
  );
  
  return {
    totalAnimais: animaisFazenda.length,
    totalCapacidade: fazenda.pastos.reduce((sum, pasto) => sum + pasto.capacidade_ua, 0),
    percentualLotacao: (totalAnimais / totalCapacidade) * 100
  };
};

// Estatísticas de Pasto
const calcularEstatisticasPasto = (pasto) => {
  const animaisPasto = dados.inventory.filter(animal => animal.localizacao === pasto.pastoId);
  const machos = animaisPasto.filter(animal => animal.sex === 'Macho').length;
  const femeas = animaisPasto.filter(animal => animal.sex === 'Fêmea').length;
  
  return {
    totalAnimais: animaisPasto.length,
    resumo: `${machos} Machos, ${femeas} Fêmeas`,
    percentualLotacao: (totalAnimais / pasto.capacidade_ua) * 100
  };
};
```

### **Sistema Drag-and-Drop**
```javascript
// Iniciar drag
const iniciarDrag = (animal) => {
  setAnimalArrastado(animal);
};

// Finalizar drag com validação
const finalizarDrag = () => {
  if (animalArrastado && pastoDestino) {
    const estatisticasPasto = calcularEstatisticasPasto(pastoDestino);
    if (estatisticasPasto.totalAnimais < pastoDestino.capacidade_ua) {
      // Mover animal
      const novosDados = {
        ...dados,
        inventory: dados.inventory.map(animal => 
          animal.animalId === animalArrastado.animalId 
            ? { ...animal, localizacao: pastoDestino.pastoId }
            : animal
        )
      };
      setDados(novosDados);
    }
  }
};
```

## 🎨 Design System

### **Cores e Estados**
- **Verde (#10b981)**: Lotação OK (< 70%)
- **Amarelo (#f59e0b)**: Atenção (70-90%)
- **Vermelho (#ef4444)**: Lotado (> 90%)
- **Azul (#3b82f6)**: Ações e interações

### **Animações**
- **Slide Down**: Expansão suave dos painéis
- **Hover Effects**: Feedback visual nos elementos
- **Drag States**: Estados visuais durante arraste
- **Transições**: Todas as mudanças são fluidas

### **Responsividade**
- **Mobile First**: Interface adaptável
- **Grid Flexível**: Layout responsivo
- **Touch Friendly**: Otimizado para toque

## 📁 Arquivos Criados/Modificados

### **Backend**
- `pecuariapro2-backend/atualizar_estrutura_rebanhos.py` - Script de atualização da estrutura

### **Frontend**
- `frontend/src/pages/MeusRebanhos.jsx` - Componente principal
- `frontend/src/pages/MeusRebanhos.css` - Estilos modernos
- `README_MEUS_REBANHOS.md` - Esta documentação

### **Dados Atualizados**
- `pecuariapro2-backend/state/npcs_save.json` - Estrutura atualizada com pastos e localização

## 🔧 Como Usar

### **1. Navegação**
- Acesse a rota `/rebanhos` no frontend
- Interface hierárquica carregada automaticamente

### **2. Visualização**
- Clique no cabeçalho da fazenda para expandir/contrair
- Clique no card do pasto para ver os animais
- Observe as estatísticas em tempo real

### **3. Gerenciamento**
- Arraste animais entre pastos
- Validação automática de capacidade
- Feedback visual durante operações

### **4. Indicadores Visuais**
- **Verde**: Lotação adequada
- **Amarelo**: Atenção necessária
- **Vermelho**: Lotação crítica

## 🎯 Benefícios Alcançados

### **Experiência do Usuário**
- ✅ **Visualização Clara**: Hierarquia intuitiva
- ✅ **Gerenciamento Fácil**: Drag-and-drop intuitivo
- ✅ **Feedback Imediato**: Estatísticas em tempo real
- ✅ **Interface Moderna**: Design atrativo e responsivo

### **Funcionalidade**
- ✅ **Distribuição Inteligente**: Animais organizados por tipo
- ✅ **Validação Automática**: Capacidade verificada
- ✅ **Atualização Instantânea**: Dashboards sempre atualizados
- ✅ **Flexibilidade**: Fácil reorganização

### **Base para Futuras Funcionalidades**
- ✅ **Monta Natural**: Base para sistema de reprodução
- ✅ **Gestão de Pastos**: Controle de lotação
- ✅ **Relatórios**: Dados estruturados para análises
- ✅ **Integração**: Compatível com outros sistemas

## 🚀 Próximos Passos

### **Melhorias Futuras**
1. **Integração com Backend**: Carregar dados reais do jogador
2. **Sistema de Monta**: Implementar reprodução natural
3. **Relatórios Avançados**: Estatísticas detalhadas
4. **Notificações**: Alertas de lotação e saúde
5. **Histórico**: Rastreamento de movimentações

### **Funcionalidades Avançadas**
1. **Rotação de Pastos**: Sistema automático
2. **Gestão de Saúde**: Controle veterinário
3. **Produção**: Rastreamento de produtividade
4. **Comercialização**: Integração com vendas
5. **Análise Genética**: Melhoramento do rebanho

---

## 🎉 Resultado Final

O sistema "Meus Rebanhos" transformou completamente a gestão de animais:

- **Antes**: Lista simples de animais
- **Depois**: Interface hierárquica com drag-and-drop

O jogador agora pode:
- Visualizar toda sua estrutura de fazendas e pastos
- Gerenciar animais de forma intuitiva
- Monitorar lotação em tempo real
- Preparar-se para sistemas avançados de reprodução

A base está pronta para implementar a mecânica de "Monta Natural" e outras funcionalidades avançadas! 🏆 