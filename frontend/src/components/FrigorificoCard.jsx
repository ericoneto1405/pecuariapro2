

function FrigorificoCard({ frigorifico, onSelecionar }) {
  // Calcula preços ajustados conforme condições de pagamento
  const base = typeof frigorifico.preco_arroba === 'number' && !isNaN(frigorifico.preco_arroba) ? frigorifico.preco_arroba : null;
  const pagamentos = Array.isArray(frigorifico.pagamento) ? frigorifico.pagamento : [];
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
    <div style={{ background: '#23272f', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: 320 }}>
      <h3 style={{ margin: 0, color: '#1976d2' }}>{frigorifico.nome}</h3>
      <div style={{ color: '#b0bec5', marginBottom: 8 }}>{frigorifico.regiao} | {frigorifico.perfil}</div>
      <div style={{ marginBottom: 8 }}>{frigorifico.descricao}</div>
      <div><b>Preço da Arroba:</b> {base !== null ? `R$ ${base.toLocaleString('pt-BR')}` : <span style={{color:'#e53935'}}>Indisponível</span>}</div>
      <div><b>Pagamento:</b></div>
      <ul style={{margin:0, paddingLeft:18}}>
        {precos.map((p, i) => (
          <li key={i}>
            {p.label}: {p.valor !== null ? <b>R$ {p.valor.toLocaleString('pt-BR', {minimumFractionDigits:2})}</b> : <span style={{color:'#e53935'}}>Indisponível</span>}
          </li>
        ))}
      </ul>
      {frigorifico.bonificacoes.length > 0 && (
        <div><b>Bonificações:</b> {frigorifico.bonificacoes.join(', ')}</div>
      )}
      {frigorifico.requisitos.length > 0 && (
        <div style={{ color: '#e53935' }}><b>Requisitos:</b> {frigorifico.requisitos.join(', ')}</div>
      )}
      <button onClick={onSelecionar} style={{ padding: '10px 20px', borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
        Selecionar Frigorífico
      </button>
    </div>
  );
}

export default FrigorificoCard; 