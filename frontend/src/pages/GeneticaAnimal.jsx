import animais from '../data/animais_exemplo.json';

function GeneticaAnimal() {
  // Usar o primeiro animal como exemplo
  const animal = animais[0];

  return (
    <div style={{ background: '#23272f', borderRadius: 12, padding: 32, color: '#fff', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ color: '#1976d2' }}>Genética do Animal</h2>
      <div style={{ marginBottom: 16 }}>
        <b>ID:</b> {animal.id} <br/>
        <b>Nome:</b> {animal.nome} <br/>
        <b>Fazenda de Origem:</b> {animal.fazenda_origem} <br/>
        <b>Data de Nascimento:</b> {animal.data_nascimento} <br/>
        <b>Sexo:</b> {animal.sexo === 'M' ? 'Macho' : 'Fêmea'} <br/>
        <b>Puro?</b> {animal.puro ? 'Sim' : 'Não'} <br/>
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Composição Racial:</b> {Object.entries(animal.composicao_racial).map(([raca, perc]) => `${raca} ${perc}%`).join(', ')}
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Genótipo Mendeliano:</b> {Object.entries(animal.genotipo).map(([carac, val]) => `${carac}: ${val}`).join(', ')}
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Valores Genéticos (VGs):</b>
        <ul>
          {Object.entries(animal.valores_geneticos).map(([carac, val]) => (
            <li key={carac}>{carac}: {val}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Fenótipo:</b>
        <ul>
          {Object.entries(animal.fenotipo).map(([carac, val]) => (
            <li key={carac}>{carac}: {val}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Genealogia:</b>
        <ul>
          <li><b>Pai:</b> {animal.genealogia.pai?.nome || '-'}</li>
          <li><b>Mãe:</b> {animal.genealogia.mae?.nome || '-'}</li>
        </ul>
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Localização:</b> Fazenda {animal.localizacao.fazenda}, {animal.localizacao.pasto}
      </div>
      <div>
        <b>Histórico Reprodutivo:</b>
        <ul>
          {animal.historico_reprodutivo.length === 0 && <li>Nenhum evento registrado.</li>}
          {animal.historico_reprodutivo.map((ev, idx) => (
            <li key={idx}>{ev.data}: {ev.tipo} com pai {ev.pai} - {ev.resultado}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GeneticaAnimal; 