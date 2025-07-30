import './MapaGeral.css';
import { useState, useEffect } from 'react';
import { getClimaParaFazendas } from '../api/climaService';

import NPCMapLayer from '../components/NPCMapLayer';
import FiltroMapa from '../components/FiltroMapa';
import '../components/NPCMapLayer.css';



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
        {/* Previsão do tempo removida temporariamente */}
      </div>
    </div>
  );
}

function MapaGeral() {
  const [fazendas, setFazendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [climas, setClimas] = useState({});
  const [climaLoading, setClimaLoading] = useState(false);
  const [modalFazenda, setModalFazenda] = useState({ aberta: false, fazenda: null });
  const [busca, setBusca] = useState('');
  
  // Novo estado de filtros
  const [filtros, setFiltros] = useState({
    bioma: '',
    tamanhoMin: 0,
    tamanhoMax: 10000,
    valorMin: 0,
    valorMax: 10000000,
    soDisponiveis: false,
    minhasFazendas: false
  });

  useEffect(() => {
    setLoading(true);
    fetch('/src/data/fazendas_mapa_geral.json')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar fazendas do arquivo local');
        return res.json();
      })
      .then(data => {
        setFazendas(data);
        
        // Inicializar ranges dos filtros baseado nos dados
        const tamanhos = data.map(f => f.tamanho_ha);
        const valores = data.map(f => f.valor_total_dinamico);
        const minTamanho = Math.min(...tamanhos);
        const maxTamanho = Math.max(...tamanhos);
        const minValor = Math.min(...valores);
        const maxValor = Math.max(...valores);
        
        setFiltros(prev => ({
          ...prev,
          tamanhoMin: minTamanho,
          tamanhoMax: maxTamanho,
          valorMin: minValor,
          valorMax: maxValor
        }));
        
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar fazendas do arquivo local');
        setLoading(false);
      });
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

  // Nova lógica de filtragem
  let fazendasFiltradas = fazendas.filter(fazenda => {
    // Filtro de busca por nome ou município
    if (busca) {
      const termoBusca = busca.toLowerCase();
      const nomeMatch = fazenda.nome.toLowerCase().includes(termoBusca);
      const municipioMatch = fazenda.municipio_uf.toLowerCase().includes(termoBusca);
      if (!nomeMatch && !municipioMatch) return false;
    }

    // Filtro por bioma
    if (filtros.bioma && fazenda.bioma !== filtros.bioma) return false;

    // Filtro por tamanho
    if (fazenda.tamanho_ha < filtros.tamanhoMin || fazenda.tamanho_ha > filtros.tamanhoMax) return false;

    // Filtro por valor
    if (fazenda.valor_total_dinamico < filtros.valorMin || fazenda.valor_total_dinamico > filtros.valorMax) return false;

    // Filtro por disponibilidade
    if (filtros.soDisponiveis && (fazenda.dono && fazenda.dono !== 'Desconhecido')) return false;

    // Filtro por minhas fazendas
    if (filtros.minhasFazendas && (!fazenda.dono || fazenda.dono.toLowerCase() !== 'jogador')) return false;

    return true;
  });

  if (loading) return <div>Carregando fazendas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{position:'relative'}}>
      <FiltroMapa
        filtros={filtros}
        onFiltrosChange={setFiltros}
        fazendas={fazendas}
        onBuscaChange={setBusca}
      />
      <NPCMapLayer fazendas={fazendasFiltradas} />
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
              {!climaLoading && (
                climas[fazenda.id] ? (
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
                ) : (
                  <div style={{marginTop:8, background:'#23272f', borderRadius:6, padding:8, color:'#e53935', fontWeight:600}}>
                    Clima indisponível
                  </div>
                )
              )}
              <p><b>Dono:</b> {semDono ? 'DISPONÍVEL' : fazenda.dono}</p>
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