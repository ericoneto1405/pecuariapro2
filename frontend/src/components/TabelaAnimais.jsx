// Tabela de listagem de animais com seleção
import React, { useState } from 'react';

function getIdadeFormatada(idade) {
  if (typeof idade === 'string') return idade;
  if (idade < 30) return `${idade} dias`;
  if (idade < 12 * 30) return `${Math.round(idade/30)} meses`;
  const anos = Math.floor(idade / 365);
  if (anos === 1) return '1 ano';
  return `${anos} anos`;
}

function formatID(id) {
  // Garante 4 letras + 4 números (ex: ABCD1234)
  if (!id) return '';
  const match = id.match(/^([A-Za-z]{4})(\d{4})$/);
  if (match) return `${match[1].toUpperCase()}${match[2]}`;
  return id;
}

const CATEGORIAS_MACHO = ['Bezerro', 'Garrote', 'Novilho', 'Boi', 'Touro'];
const CATEGORIAS_FEMEA = ['Bezerra', 'Novilha', 'Vaca'];

function TabelaAnimais({ animais, selecionados, onSelecionar, onSelecionarTodos, onCategoriaChange }) {
  // Estado local para edição inline (opcional)
  const [editando, setEditando] = useState(null);

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px #0002', background: '#23272f' }}>
      <table style={{ width: '100%', color: '#fff', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr style={{ background: '#1a202c', height: 48 }}>
            <th style={{ width: 48, textAlign: 'center', verticalAlign: 'middle' }}>
              <input type="checkbox" style={{ transform: 'scale(1.2)', verticalAlign: 'middle' }} checked={animais.length > 0 && selecionados.length === animais.length} onChange={e => onSelecionarTodos(e.target.checked)} />
            </th>
            <th style={{ textAlign: 'left', paddingLeft: 12, fontWeight: 700, fontSize: 15 }}>ID</th>
            <th style={{ textAlign: 'center', fontWeight: 700, fontSize: 15 }}>Sexo</th>
            <th style={{ textAlign: 'left', fontWeight: 700, fontSize: 15 }}>Raça</th>
            <th style={{ textAlign: 'left', fontWeight: 700, fontSize: 15 }}>Categoria / Idade</th>
            <th style={{ textAlign: 'left', fontWeight: 700, fontSize: 15 }}>Status</th>
            <th style={{ textAlign: 'left', fontWeight: 700, fontSize: 15 }}>Localização</th>
          </tr>
        </thead>
        <tbody>
          {animais.map(animal => (
            <tr key={animal.id} style={{ background: selecionados.includes(animal.id) ? '#263043' : 'inherit', height: 44 }}>
              <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <input type="checkbox" style={{ transform: 'scale(1.1)', verticalAlign: 'middle' }} checked={selecionados.includes(animal.id)} onChange={e => onSelecionar(animal.id, e.target.checked)} />
              </td>
              <td style={{ paddingLeft: 12 }}>{formatID(animal.id)}</td>
              <td style={{ textAlign: 'center' }}>{animal.sexo === 'M' ? '♂️' : animal.sexo === 'F' ? '♀️' : '-'}</td>
              <td>{animal.raca}</td>
              <td>
                {editando === animal.id ? (
                  <select
                    value={animal.categoria}
                    onChange={e => onCategoriaChange(animal.id, e.target.value)}
                    onBlur={() => setEditando(null)}
                    autoFocus
                  >
                    {(animal.sexo === 'M' ? CATEGORIAS_MACHO : CATEGORIAS_FEMEA).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                ) : (
                  <span onClick={() => setEditando(animal.id)} style={{ cursor: 'pointer', textDecoration: 'underline dotted' }} title="Clique para editar">
                    {animal.categoria}
                  </span>
                )}
                <span style={{ color: '#b0bec5', fontSize: 13, marginLeft: 6 }}>/ {animal.idadeMeses ? `${animal.idadeMeses} meses` : '-'}</span>
              </td>
              <td>
                {animal.sexo === 'F' ? (
                  animal.prenha ? (
                    <span style={{ color: '#facc15', fontWeight: 600 }}>PRENHA</span>
                  ) : animal.qtdPartos > 0 ? (
                    <span style={{ color: '#4ade80', fontWeight: 600 }}>PARIU {animal.qtdPartos}x</span>
                  ) : (
                    <span style={{ color: '#b0bec5', fontWeight: 600 }}>NUNCA PARIU</span>
                  )
                ) : (
                  <span style={{ color: '#b0bec5' }}>-</span>
                )}
              </td>
              <td>{animal.localizacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaAnimais;
