import './MapaGeral.css';
import { useState, useEffect } from 'react';
function ModalFazenda({ aberta, fazenda, onFechar }) {
  if (!aberta || !fazenda) return null;
  const semDono = !fazenda.dono || fazenda.dono === 'Desconhecido';
  const doJogador = fazenda.dono && fazenda.dono.toLowerCase() === 'jogador';
  const deNPC = !semDono && !doJogador;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#23272f', borderRadius: 16, padding: 40, minWidth: 600, maxWidth: 900, minHeight: 420, boxShadow: '0 4px 32px #0008', position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button onClick={onFechar} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h3 style={{ color: '#90caf9', marginBottom: 16 }}>{fazenda.nome}</h3>
        <div style={{ color: '#b0bec5', marginBottom: 12 }}>Bioma: {fazenda.bioma} | Município/UF: {fazenda.municipio_uf}</div>
        <div style={{ color: '#b0bec5', marginBottom: 12 }}>Tamanho: {fazenda.tamanho_ha} ha | Potencial UA/ha: {fazenda.potencial_base_ha}</div>
        {/* Seções de funcionalidades futuras */}
        {doJogador && (
          <>
            <div style={{ margin: '24px 0 8px 0', color: '#fff', fontWeight: 600, fontSize: 18 }}>Gestão da Fazenda</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
              <button style={{ background: '#4ade80', color: '#23272f', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Gerenciar Fazenda</button>
              <button style={{ background: '#eab308', color: '#23272f', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Colocar à venda</button>
            </div>
            <div style={{ margin: '16px 0 8px 0', color: '#fff', fontWeight: 600 }}>Ações disponíveis:</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button style={{ background: '#38bdf8', color: '#23272f', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Plantar pastagem do inventário</button>
              <button style={{ background: '#f472b6', color: '#23272f', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Implantar projeto de Confinamento</button>
              {/* Outras ações futuras aqui */}
            </div>
          </>
        )}
        {semDono && (
          <>
            <div style={{ color: '#00e676', fontWeight: 600, marginBottom: 12 }}>Valor: R$ {fazenda.valor_total_dinamico.toLocaleString('pt-BR')}</div>
            <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Comprar Fazenda</button>
          </>
        )}
        {deNPC && (
          <>
            <div style={{ color: '#b0bec5', marginBottom: 12 }}>Dono: {fazenda.dono}</div>
            <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Negociar com NPC</button>
          </>
        )}
      </div>
    </div>
  );
}
import fazendasData from '../data/fazendas_mapa_geral.json';
import { getClimaParaFazendas } from '../api/climaService';

const ORDENACOES = {
  PADRAO: 'PADRAO',
  TAMANHO_CRESC: 'TAMANHO_CRESC',
  TAMANHO_DESC: 'TAMANHO_DESC',
  VALOR_CRESC: 'VALOR_CRESC',
  VALOR_DESC: 'VALOR_DESC',
};


function MapaGeral() {
  const [ordenacao, setOrdenacao] = useState(ORDENACOES.PADRAO);
  const [soDisponiveis, setSoDisponiveis] = useState(false);
  const [fazendas, setFazendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [climas, setClimas] = useState({});
  const [climaLoading, setClimaLoading] = useState(false);
  const [minhasFazendas, setMinhasFazendas] = useState(false);
  const [biomaFiltro, setBiomaFiltro] = useState('');
  const [ordemUA, setOrdemUA] = useState(''); // '' | 'asc' | 'desc'
  const [modalFazenda, setModalFazenda] = useState({ aberta: false, fazenda: null });

  useEffect(() => {
    setLoading(true);
    try {
      setFazendas(fazendasData);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar fazendas do arquivo local');
      setLoading(false);
    }
  }, []);

  // Buscar clima para todas as fazendas ao carregar
  useEffect(() => {
    if (fazendas.length > 0) {
      setClimaLoading(true);
      getClimaParaFazendas(fazendas)
        .then(results => {
          const climaMap = {};
          results.forEach(r => {
            if (r.clima) climaMap[r.fazendaId] = r.clima;
          });
          setClimas(climaMap);
          setClimaLoading(false);
        })
        .catch(() => setClimaLoading(false));
    }
  }, [fazendas]);

  let fazendasFiltradas = fazendas;
  if (soDisponiveis) {
    fazendasFiltradas = fazendasFiltradas.filter(f => !f.dono || f.dono === 'Desconhecido');
  }
  if (minhasFazendas) {
    fazendasFiltradas = fazendasFiltradas.filter(f => f.dono && f.dono.toLowerCase() === 'jogador');
  }
  if (biomaFiltro) {
    fazendasFiltradas = fazendasFiltradas.filter(f => f.bioma === biomaFiltro);
  }
  if (ordemUA === 'asc') {
    fazendasFiltradas = [...fazendasFiltradas].sort((a, b) => a.potencial_base_ha - b.potencial_base_ha);
  } else if (ordemUA === 'desc') {
    fazendasFiltradas = [...fazendasFiltradas].sort((a, b) => b.potencial_base_ha - a.potencial_base_ha);
  } else if (ordenacao === ORDENACOES.TAMANHO_CRESC) {
    fazendasFiltradas = [...fazendasFiltradas].sort((a, b) => a.tamanho_ha - b.tamanho_ha);
  } else if (ordenacao === ORDENACOES.TAMANHO_DESC) {
    fazendasFiltradas = [...fazendasFiltradas].sort((a, b) => b.tamanho_ha - a.tamanho_ha);
  } else if (ordenacao === ORDENACOES.VALOR_CRESC) {
    fazendasFiltradas = [...fazendasFiltradas].sort((a, b) => a.valor_total_dinamico - b.valor_total_dinamico);
  } else if (ordenacao === ORDENACOES.VALOR_DESC) {
    fazendasFiltradas = [...fazendasFiltradas].sort((a, b) => b.valor_total_dinamico - a.valor_total_dinamico);
  }

  // Obter biomas únicos
  const biomas = Array.from(new Set(fazendas.map(f => f.bioma))).filter(Boolean);

  if (loading) return <div>Carregando fazendas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <span><b>Ordenar por:</b></span>
        <button onClick={() => setOrdenacao(ORDENACOES.TAMANHO_CRESC)}>Tamanho ↑</button>
        <button onClick={() => setOrdenacao(ORDENACOES.TAMANHO_DESC)}>Tamanho ↓</button>
        <button onClick={() => setOrdenacao(ORDENACOES.VALOR_CRESC)}>Valor ↑</button>
        <button onClick={() => setOrdenacao(ORDENACOES.VALOR_DESC)}>Valor ↓</button>
        <button onClick={() => setOrdenacao(ORDENACOES.PADRAO)}>Padrão</button>
        <label style={{ marginLeft: 24 }}>
          <input type="checkbox" checked={soDisponiveis} onChange={e => setSoDisponiveis(e.target.checked)} /> Disponíveis para compra
        </label>
        <label style={{ marginLeft: 24 }}>
          <input type="checkbox" checked={minhasFazendas} onChange={e => setMinhasFazendas(e.target.checked)} /> Minhas Fazendas
        </label>
        <label style={{ marginLeft: 24 }}>
          Bioma:
          <select value={biomaFiltro} onChange={e => setBiomaFiltro(e.target.value)} style={{ marginLeft: 8, background: '#181a1f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }}>
            <option value="">Todos</option>
            {biomas.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label style={{ marginLeft: 24 }}>
          Potencial UA/ha:
          <select value={ordemUA} onChange={e => setOrdemUA(e.target.value)} style={{ marginLeft: 8, background: '#181a1f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }}>
            <option value="">-</option>
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {fazendasFiltradas.map(fazenda => {
          const semDono = !fazenda.dono || fazenda.dono === 'Desconhecido';
          return (
            <div
              key={fazenda.id}
              className="fazenda-card"
              style={{ cursor: 'pointer' }}
              onClick={() => setModalFazenda({ aberta: true, fazenda })}
            >
              <h3 style={{ margin: '0 0 8px 0' }}>{fazenda.nome}</h3>
              <p><b>Bioma:</b> {fazenda.bioma}</p>
              <p><b>Município/UF:</b> {fazenda.municipio_uf}</p>
              <p><b>Tamanho:</b> {fazenda.tamanho_ha} ha</p>
              <p><b>Potencial UA/ha:</b> {fazenda.potencial_base_ha}</p>
              <p><b>Produtividade real/ha:</b> {fazenda.produtividade_real_ha}</p>
              {climaLoading && <div style={{color:'#b0bec5'}}>Carregando clima...</div>}
              {!climaLoading && climas[fazenda.id] && (
                <div style={{marginTop:8, background:'#23272f', borderRadius:6, padding:8, display:'flex', alignItems:'center', gap:8}}>
                  {(() => {
                    const desc = climas[fazenda.id].descricao?.toLowerCase() || '';
                    let label = 'Clima indefinido';
                    let emoji = '❓';
                    if (desc.includes('chuva')) { label = 'Chuva'; emoji = '🌧️'; }
                    else if (desc.includes('nublado')) { label = 'Nublado'; emoji = '☁️'; }
                    else if (desc.includes('sol') || desc.includes('céu limpo')) { label = 'Ensolarado'; emoji = '☀️'; }
                    else if (desc.includes('neblina')) { label = 'Neblina'; emoji = '🌫️'; }
                    else if (desc.includes('tempestade')) { label = 'Tempestade'; emoji = '⛈️'; }
                    else if (desc.includes('neve')) { label = 'Neve'; emoji = '❄️'; }
                    else if (desc.includes('garoa')) { label = 'Garoa'; emoji = '🌦️'; }
                    else if (desc.includes('vento')) { label = 'Ventania'; emoji = '💨'; }
                    else if (desc.includes('trovão')) { label = 'Trovoada'; emoji = '🌩️'; }
                    return (
                      <>
                        <span style={{fontSize:22}}>{emoji}</span>
                        <span><b>{label}</b> <span style={{color:'#b0bec5'}}>({climas[fazenda.id].descricao})</span></span>
                        <span style={{marginLeft:8}}><b>{climas[fazenda.id].temperatura}°C</b></span>
                        {climas[fazenda.id].icone && (
                          <img src={`https://openweathermap.org/img/wn/${climas[fazenda.id].icone}.png`} alt="" style={{verticalAlign:'middle',marginLeft:4}} />
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
              {!semDono && (
                <p><b>Dono:</b> {fazenda.dono}</p>
              )}
              {semDono && (
                <p style={{ color: '#00e676', fontWeight: 600 }}><b>Valor:</b> R$ {fazenda.valor_total_dinamico.toLocaleString('pt-BR')}</p>
              )}
            </div>
          );
        })}
      </div>
      <ModalFazenda aberta={modalFazenda.aberta} fazenda={modalFazenda.fazenda} onFechar={() => setModalFazenda({ aberta: false, fazenda: null })} />
    </div>
  );
}

export default MapaGeral; 