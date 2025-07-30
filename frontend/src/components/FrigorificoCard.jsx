

import BarraRelacionamentoFrigorifico from './BarraRelacionamentoFrigorifico';

function FrigorificoCard({ frigorifico, onSelecionar }) {
  // Valores padrão para campos opcionais
  const pagamentos = Array.isArray(frigorifico.pagamento) ? frigorifico.pagamento : [];
  const bonificacoes = Array.isArray(frigorifico.bonificacoes) ? frigorifico.bonificacoes : [];
  const requisitos = Array.isArray(frigorifico.requisitos) ? frigorifico.requisitos : [];
  const regiao = frigorifico.regiao || '';
  const perfil = frigorifico.perfil || '';
  const descricao = frigorifico.descricao || '';
  const base = (frigorifico.preco_arroba != null && !isNaN(frigorifico.preco_arroba)) ? frigorifico.preco_arroba : null;
  const precos = pagamentos.map(p => {
    if (!base) return { label: p, valor: null };
    if (p.toLowerCase().includes('à vista')) return { label: p, valor: base * 0.97 };
    const match = p.match(/(\d+)/);
    if (match) {
      const dias = parseInt(match[1], 10);
      const acrescimos = Math.floor(dias / 30);
      return { label: p, valor: base * (1 + 0.03 * acrescimos) };
    }
    return { label: p, valor: base };
  });

  return (
    <div style={{
      background: '#23272f',
      borderRadius: 12,
      padding: 32,
      marginBottom: 32,
      boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
      minWidth: 420,
      maxWidth: 600,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 260
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <h3 style={{ margin: 0, color: '#1976d2' }}>{frigorifico.nome}</h3>
          <div style={{ color: '#b0bec5', marginBottom: 8 }}>{regiao} | {perfil}</div>
        </div>
        <div style={{ alignSelf: 'flex-start', marginLeft: 16 }}>
          {/* Temporariamente comentado para debug */}
          {/* <BarraRelacionamentoFrigorifico frigorificoId={frigorifico.id?.toString() || frigorifico.id} horizontal /> */}
          <div style={{ fontSize: 12, color: '#b0bec5' }}>Relacionamento: 75%</div>
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>{descricao}</div>
      <div style={{ marginBottom: 8 }}><b>Preço da Arroba:</b> {base !== null ? `R$ ${base.toLocaleString('pt-BR')}` : <span style={{color:'#e53935'}}>Indisponível</span>}</div>
      <div><b>Pagamento:</b></div>
      <ul style={{margin:0, paddingLeft:18, marginBottom: 8}}>
        {precos.map((p, i) => (
          <li key={i}>
            {p.label}: {p.valor !== null ? <b>R$ {p.valor.toLocaleString('pt-BR', {minimumFractionDigits:2})}</b> : <span style={{color:'#e53935'}}>Indisponível</span>}
          </li>
        ))}
      </ul>
      {bonificacoes.length > 0 && (
        <div style={{ marginBottom: 8 }}><b>Bonificações:</b> {bonificacoes.join(', ')}</div>
      )}
      {requisitos.length > 0 && (
        <div style={{ color: '#e53935', marginBottom: 8 }}><b>Requisitos:</b> {requisitos.join(', ')}</div>
      )}
      <button onClick={onSelecionar} style={{ padding: '12px 28px', borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, fontSize: 17, cursor: 'pointer', alignSelf: 'flex-end', marginTop: 'auto' }}>
        Selecionar Frigorífico
      </button>
    </div>
  );
}

export default FrigorificoCard; 