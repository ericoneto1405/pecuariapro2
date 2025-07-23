import React, { useState } from 'react';

// Exemplo de ícones por tipo (pode ser substituído por SVGs reais)
const ICONES = {
  sementes: '🌱',
  projetos: '📐',
  insumos: '🧪',
  outros: '📦',
};

// Exemplo de dados mockados
const MOCK_INVENTARIO = [
  { tipo: 'sementes', nome: 'Capim Piatã', quantidade: 10, loja: 'AgroPasto', data: '2025-07-22' },
  { tipo: 'projetos', nome: 'Projeto Confinamento', quantidade: 1, loja: 'AgroZeus', data: '2025-07-23' },
  { tipo: 'insumos', nome: 'Fertilizante NPK', quantidade: 5, loja: 'Pampa Sementes', data: '2025-07-20' },
];

const TIPOS = ['sementes', 'projetos', 'insumos', 'outros'];

export default function InventarioTabela({ inventario = MOCK_INVENTARIO }) {
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroLoja, setFiltroLoja] = useState('');

  // Filtros
  const itensFiltrados = inventario.filter(item =>
    (!filtroTipo || item.tipo === filtroTipo) &&
    (!filtroNome || item.nome.toLowerCase().includes(filtroNome.toLowerCase())) &&
    (!filtroLoja || item.loja.toLowerCase().includes(filtroLoja.toLowerCase()))
  );

  // Agrupamento por tipo para colunas
  const agrupadoPorTipo = {};
  TIPOS.forEach(tipo => {
    agrupadoPorTipo[tipo] = itensFiltrados.filter(item => item.tipo === tipo);
  });

  // Resumo
  const totalItens = itensFiltrados.reduce((acc, item) => acc + item.quantidade, 0);
  // Valor estimado pode ser adicionado se houver preço

  return (
    <div style={{ background: '#23272f', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0002' }}>
      <div style={{ marginBottom: 18, display: 'flex', gap: 16, alignItems: 'center' }}>
        <b>Total de itens:</b> {totalItens}
        {/* <b>Valor estimado:</b> R$ ... */}
        <input placeholder="Filtrar por nome" value={filtroNome} onChange={e => setFiltroNome(e.target.value)} style={{ marginLeft: 16, background: '#181a1f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
        <input placeholder="Filtrar por loja" value={filtroLoja} onChange={e => setFiltroLoja(e.target.value)} style={{ background: '#181a1f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={{ background: '#181a1f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }}>
          <option value="">Todos os tipos</option>
          {TIPOS.map(tipo => <option key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</option>)}
        </select>
      </div>
      <table style={{ width: '100%', color: '#fff', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr style={{ background: '#1a202c', height: 48 }}>
            {TIPOS.map(tipo => (
              <th key={tipo} style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, borderRadius: 8 }}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {TIPOS.map(tipo => (
              <td key={tipo} style={{ verticalAlign: 'top', background: '#23272f', borderRadius: 8, minWidth: 180 }}>
                {agrupadoPorTipo[tipo].length === 0 ? <span style={{ color: '#b0bec5' }}>-</span> : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {agrupadoPorTipo[tipo].map((item, idx) => (
                      <li key={idx} style={{ marginBottom: 12, background: '#181a1f', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>{ICONES[item.tipo] || ICONES.outros}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.nome}</div>
                          <div style={{ fontSize: 13, color: '#b0bec5' }}>Qtd: {item.quantidade}</div>
                          <div style={{ fontSize: 13, color: '#b0bec5' }}>Loja: {item.loja}</div>
                          <div style={{ fontSize: 13, color: '#b0bec5' }}>Data: {item.data}</div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                            {['Vacina', 'Master', 'Ivermectina', 'Saúde', 'Ourofino'].some(palavra => item.nome.toLowerCase().includes(palavra.toLowerCase())) && (
                              <button style={{ background: '#4ade80', color: '#23272f', border: 'none', borderRadius: 6, padding: '2px 10px', fontWeight: 600, cursor: 'pointer' }}>Aplicar</button>
                            )}
                            <button disabled style={{ background: '#eab308', color: '#23272f', border: 'none', borderRadius: 6, padding: '2px 10px', fontWeight: 600, cursor: 'not-allowed', opacity: 0.6 }}>Vender</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
