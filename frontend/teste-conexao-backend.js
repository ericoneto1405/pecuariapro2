// teste-conexao-backend.js - Script para testar conexão frontend-backend

const BASE_URL = 'http://localhost:5050';

async function testarConexao() {
  console.log('🔍 Testando conexão com o backend...\n');
  
  const endpoints = [
    '/api/competicao/juizes',
    '/api/competicao/categorias',
    '/api/competicao/racas',
    '/api/npcs/state',
    '/api/catalog/semen'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testando: ${endpoint}`);
      const response = await fetch(`${BASE_URL}${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Sucesso: ${endpoint}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Dados: ${JSON.stringify(data).substring(0, 100)}...`);
      } else {
        console.log(`❌ Erro: ${endpoint} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Falha: ${endpoint} - ${error.message}`);
    }
    console.log('');
  }
  
  // Testar competição completa
  console.log('🏆 Testando competição completa...');
  try {
    const response = await fetch(`${BASE_URL}/api/competicao/julgar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raca: 'Angus',
        categoria: 'Macho Jovem',
        animais_inscritos: ['ANGU0004', 'ANGU0003']
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Competição processada com sucesso!');
      console.log(`   Juiz: ${data.juiz?.nome}`);
      console.log(`   Total de animais: ${data.competicao?.total_animais}`);
      console.log(`   Vencedor: ${data.podio?.primeiro_lugar?.animalId}`);
    } else {
      console.log(`❌ Erro na competição: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Falha na competição: ${error.message}`);
  }
}

// Executar teste
testarConexao().then(() => {
  console.log('🎯 Teste de conexão concluído!');
}).catch(error => {
  console.error('💥 Erro no teste:', error);
}); 