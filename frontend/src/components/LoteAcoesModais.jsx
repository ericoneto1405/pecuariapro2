import React, { useState } from 'react';

// Modal genérico para seleção de destino ou frigorífico
export default function LoteAcoesModais({
  open,
  onClose,
  tipo, // 'fazenda' | 'pasto' | 'frigorifico'
  opcoes = [], // [{id, nome}]
  onConfirmar,
  children
}) {
  const [selecionado, setSelecionado] = useState('');
  return open ? (
    <div style={{ position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'#0008', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#23272f', borderRadius:12, padding:32, minWidth:320 }}>
        <h3 style={{marginTop:0}}>
          {tipo === 'fazenda' && 'Transferir para Fazenda'}
          {tipo === 'pasto' && 'Transferir para Pasto'}
          {tipo === 'frigorifico' && 'Vender para Frigorífico'}
        </h3>
        <div style={{marginBottom:16}}>
          <select value={selecionado} onChange={e=>setSelecionado(e.target.value)} style={{width:'100%',padding:8}}>
            <option value="">Selecione...</option>
            {opcoes.map(o=>(<option key={o.id} value={o.id}>{o.nome}</option>))}
          </select>
        </div>
        {children}
        <div style={{display:'flex',gap:12,marginTop:24}}>
          <button onClick={onClose}>Cancelar</button>
          <button disabled={!selecionado} onClick={()=>onConfirmar(selecionado)}>Confirmar</button>
        </div>
      </div>
    </div>
  ) : null;
}
