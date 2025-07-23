import { useState } from 'react';
import { cruzarAnimais } from '../utils/cruzamento';

// Mock de animais (fêmeas e machos)
const FEMEAS = [
  { id: 'JBRD0001', nome: 'Bezerra 1', fazenda: 'JBRD', pasto: 'Pasto 1', apta: true, fertilidade: 0.8, genotipo: { chifres: 'Pp', cor: 'Bb' }, valores_geneticos: { gpd: 1.2, fertilidade: 0.8 }, composicao_racial: { Angus: 75, Nelore: 25 }, localizacao: { fazenda: 'JBRD', pasto: 'Pasto 1' } },
  { id: 'JBRD0002', nome: 'Vaca Nelore 1', fazenda: 'JBRD', pasto: 'Pasto 1', apta: true, fertilidade: 0.7, genotipo: { chifres: 'pp', cor: 'Bb' }, valores_geneticos: { gpd: 1.0, fertilidade: 0.7 }, composicao_racial: { Nelore: 100 }, localizacao: { fazenda: 'JBRD', pasto: 'Pasto 1' } },
];
const MACHOS = [
  { id: 'JBRD0009', nome: 'Touro Angus 1', fazenda: 'JBRD', pasto: 'Pasto 1', fertilidade: 0.9, genotipo: { chifres: 'PP', cor: 'BB' }, valores_geneticos: { gpd: 1.4, fertilidade: 0.9 }, composicao_racial: { Angus: 100 }, localizacao: { fazenda: 'JBRD', pasto: 'Pasto 1' } },
  { id: 'JBRD0010', nome: 'Touro Nelore 2', fazenda: 'JBRD', pasto: 'Pasto 2', fertilidade: 0.8, genotipo: { chifres: 'pp', cor: 'Bb' }, valores_geneticos: { gpd: 1.1, fertilidade: 0.8 }, composicao_racial: { Nelore: 100 }, localizacao: { fazenda: 'JBRD', pasto: 'Pasto 2' } },
];
const SEMEN_CENTRAL = [
  { id: 'S001', nome: 'Touro Angus Top', raca: 'Angus', qualidade: 0.98, preco: 150, genotipo: { chifres: 'PP', cor: 'BB' }, valores_geneticos: { gpd: 1.5, fertilidade: 0.9 }, composicao_racial: { Angus: 100 }, localizacao: { fazenda: 'Central', pasto: '-' } },
  { id: 'S002', nome: 'Touro Nelore Elite', raca: 'Nelore', qualidade: 0.95, preco: 120, genotipo: { chifres: 'pp', cor: 'Bb' }, valores_geneticos: { gpd: 1.3, fertilidade: 0.85 }, composicao_racial: { Nelore: 100 }, localizacao: { fazenda: 'Central', pasto: '-' } },
];

function ManejoReprodutivo() {
  const [metodo, setMetodo] = useState('monta');
  const [femeasSelecionadas, setFemeasSelecionadas] = useState([]);
  const [machoSelecionado, setMachoSelecionado] = useState('');
  const [semenSelecionado, setSemenSelecionado] = useState('');
  const [resultado, setResultado] = useState(null);
  const [novoAnimal, setNovoAnimal] = useState(null);

  // Fêmeas aptas
  const femeasAptas = FEMEAS.filter(f => f.apta);
  // Machos disponíveis na mesma fazenda/pasto
  const machosDisponiveis = MACHOS.filter(m => m.fazenda === 'JBRD' && m.pasto === 'Pasto 1');

  function simularMontaNatural() {
    if (!machoSelecionado || femeasSelecionadas.length === 0) return;
    const pai = MACHOS.find(m => m.id === machoSelecionado);
    const resultados = femeasSelecionadas.map(fid => {
      const femea = FEMEAS.find(f => f.id === fid);
      const taxa = 0.5 * femea.fertilidade * pai.fertilidade;
      const prenha = Math.random() < taxa;
      let bezerro = null;
      if (prenha) {
        bezerro = cruzarAnimais(femea, pai, {
          heterose: Object.keys(femea.composicao_racial).some(r => !Object.keys(pai.composicao_racial).includes(r)),
          endogamia: false // lógica real pode ser expandida
        });
      }
      return { femea: femea.nome, pai: pai.nome, prenha, bezerro };
    });
    setResultado(resultados);
    // Exemplo: mostrar o primeiro novo animal gerado
    const novo = resultados.find(r => r.bezerro)?.bezerro;
    setNovoAnimal(novo || null);
  }

  function simularIATF() {
    if (!semenSelecionado || femeasSelecionadas.length === 0) return;
    const semen = SEMEN_CENTRAL.find(s => s.id === semenSelecionado);
    const resultados = femeasSelecionadas.map(fid => {
      const femea = FEMEAS.find(f => f.id === fid);
      const taxa = 0.5 * femea.fertilidade * semen.qualidade;
      const prenha = Math.random() < taxa;
      let bezerro = null;
      if (prenha) {
        bezerro = cruzarAnimais(femea, semen, {
          heterose: Object.keys(femea.composicao_racial).some(r => !Object.keys(semen.composicao_racial).includes(r)),
          endogamia: false
        });
      }
      return { femea: femea.nome, pai: semen.nome, prenha, bezerro };
    });
    setResultado(resultados);
    const novo = resultados.find(r => r.bezerro)?.bezerro;
    setNovoAnimal(novo || null);
  }

  return (
    <div style={{ background: '#23272f', borderRadius: 12, padding: 32, color: '#fff', maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ color: '#1976d2' }}>Manejo Reprodutivo</h2>
      <div style={{ marginBottom: 24 }}>
        <label>
          <input type="radio" checked={metodo === 'monta'} onChange={() => setMetodo('monta')} /> Monta Natural
        </label>
        <label style={{ marginLeft: 24 }}>
          <input type="radio" checked={metodo === 'iatf'} onChange={() => setMetodo('iatf')} /> IATF (Inseminação Artificial)
        </label>
      </div>
      {/* Seleção de fêmeas */}
      <div style={{ marginBottom: 16 }}>
        <b>Fêmeas aptas:</b>
        <ul>
          {femeasAptas.map(f => (
            <li key={f.id}>
              <label>
                <input
                  type="checkbox"
                  checked={femeasSelecionadas.includes(f.id)}
                  onChange={e => {
                    setFemeasSelecionadas(e.target.checked
                      ? [...femeasSelecionadas, f.id]
                      : femeasSelecionadas.filter(id => id !== f.id));
                  }}
                /> {f.nome} (Fertilidade: {f.fertilidade})
              </label>
            </li>
          ))}
        </ul>
      </div>
      {/* Seleção de macho ou sêmen */}
      {metodo === 'monta' && (
        <div style={{ marginBottom: 16 }}>
          <b>Machos disponíveis na fazenda/pasto:</b>
          <ul>
            {machosDisponiveis.length === 0 && <li>Nenhum touro disponível.</li>}
            {machosDisponiveis.map(m => (
              <li key={m.id}>
                <label>
                  <input
                    type="radio"
                    checked={machoSelecionado === m.id}
                    onChange={() => setMachoSelecionado(m.id)}
                  /> {m.nome} (Fertilidade: {m.fertilidade})
                </label>
              </li>
            ))}
          </ul>
          <button onClick={simularMontaNatural} style={{ marginTop: 8, padding: '8px 16px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Simular Monta Natural
          </button>
        </div>
      )}
      {metodo === 'iatf' && (
        <div style={{ marginBottom: 16 }}>
          <b>Catálogo Central de Sêmen:</b>
          <ul>
            {SEMEN_CENTRAL.map(s => (
              <li key={s.id}>
                <label>
                  <input
                    type="radio"
                    checked={semenSelecionado === s.id}
                    onChange={() => setSemenSelecionado(s.id)}
                  /> {s.nome} ({s.raca}) - Qualidade: {s.qualidade} - Preço: R$ {s.preco}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={simularIATF} style={{ marginTop: 8, padding: '8px 16px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Simular IATF
          </button>
        </div>
      )}
      {/* Resultado */}
      {resultado && (
        <div style={{ marginTop: 24, background: '#181a1f', borderRadius: 8, padding: 16 }}>
          <b>Resultado da Simulação:</b>
          <ul>
            {resultado.map((r, idx) => (
              <li key={idx}>{r.femea} x {r.pai} - {r.prenha ? <span style={{ color: '#00e676' }}>Prenha</span> : <span style={{ color: '#e53935' }}>Vazia</span>}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Novo animal gerado */}
      {novoAnimal && (
        <div style={{ marginTop: 24, background: '#23272f', borderRadius: 8, padding: 16 }}>
          <b>Novo animal gerado:</b>
          <div>ID: {novoAnimal.id}</div>
          <div>Sexo: {novoAnimal.sexo === 'M' ? 'Macho' : 'Fêmea'}</div>
          <div>Composição racial: {Object.entries(novoAnimal.composicao_racial).map(([r, p]) => `${r} ${p}%`).join(', ')}</div>
          <div>Genótipo: {Object.entries(novoAnimal.genotipo).map(([c, v]) => `${c}: ${v}`).join(', ')}</div>
          <div>VGs: {Object.entries(novoAnimal.valores_geneticos).map(([c, v]) => `${c}: ${v}`).join(', ')}</div>
        </div>
      )}
    </div>
  );
}

export default ManejoReprodutivo; 