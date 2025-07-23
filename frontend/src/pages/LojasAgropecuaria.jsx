// ...existing code...
// (Removido LOJAS duplicado e inválido)
import React, { useState } from 'react';
import LojaAgropecuariaCard from '../components/LojaAgropecuariaCard';
import { lancarDespesa } from '../api/financeiroService';

const LOJAS = [
  {
    nome: 'AgroPasto',
    descricao: 'Especializada em sementes tropicais e consórcios para pastagens de alta produtividade.',
    itens: [
      { nome: 'Capim Piatã', especie: 'Urochloa brizantha', preco: 220, unidade: 'ha' },
      { nome: 'Capim Zuri', especie: 'Megathyrsus maximus', preco: 304, unidade: 'ha' },
      { nome: 'Capim Humidicola', especie: 'Urochloa humidicola', preco: 300, unidade: 'ha' },
      { nome: 'Consórcio Braquiarão + Amendoim Forrageiro', especie: 'U. brizantha cv. Marandu + Arachis pintoi', preco: 894, unidade: 'ha' },
      { nome: 'Capim Buffel', especie: 'Cenchrus ciliaris', preco: 240, unidade: 'ha' },
      { nome: 'Gliricídia', especie: 'Gliricidia sepium', preco: 8750, unidade: 'ha', detalhe: 'Banco de proteína' },
    ],
  },
  {
    nome: 'Pampa Sementes',
    descricao: 'Soluções para o bioma Pampa e pastagens de inverno.',
    itens: [
      { nome: 'Capim-Forquilha', especie: 'Paspalum notatum cv. Pensacola', preco: 675, unidade: 'ha' },
      { nome: 'Aveia-Preta', especie: 'Avena strigosa', preco: 320, unidade: 'ha' },
      { nome: 'Capim-Tanner', especie: 'Brachiaria arrecta', preco: 250, unidade: 'ha', detalhe: 'Plantio por mudas/material vegetativo' },
      { nome: 'Capim Mombaça', especie: 'Megathyrsus maximus', preco: 294, unidade: 'ha' },
      { nome: 'Amendoim Forrageiro', especie: 'Arachis pintoi', preco: 750, unidade: 'ha' },
    ],
  },
  {
    nome: 'AgroZeus',
    descricao: 'Executamos obras e desenvolvemos projetos de engenharia e arquitetura para o Agronegócio.',
    itens: [
      { nome: 'Projeto Confinamento - 100 animais', especie: '', preco: 300000, unidade: 'projeto' },
      { nome: 'Projeto Confinamento - 200 animais', especie: '', preco: 450000, unidade: 'projeto' },
      { nome: 'Projeto Confinamento - 400 animais', especie: '', preco: 750000, unidade: 'projeto' },
      { nome: 'Projeto Confinamento - 600 animais', especie: '', preco: 1050000, unidade: 'projeto' },
      { nome: 'Projeto Confinamento - 1.000 animais', especie: '', preco: 1200000, unidade: 'projeto' },
      { nome: 'Projeto Confinamento - 5.000 animais', especie: '', preco: 5000000, unidade: 'projeto' },
      { nome: 'Bebedouro de concreto para 350 litros', especie: '', preco: 800, unidade: 'unidade', detalhe: '' },
      { nome: 'Cocho para Ração ou Sal (coberto, capacidade 400kg.)', especie: '', preco: 3000, unidade: 'unidade', detalhe: '' },
    ],
  },
  {
    nome: 'Saúde do Campo',
    descricao: 'Vacinas e medicamentos para saúde animal.',
    itens: [
      { nome: 'Vacina contra Febre Aftosa (Frasco 15 doses)', especie: '', preco: 23, unidade: 'frasco' },
      { nome: 'Vacina contra Febre Aftosa (Frasco 30 doses)', especie: '', preco: 60, unidade: 'frasco' },
      { nome: 'Vacina contra Raiva dos Herbívoros (Frasco com 25 doses)', especie: '', preco: 47, unidade: 'frasco' },
      { nome: 'Vacina contra Brucelose RB 51 (Frasco com 25 doses)', especie: '', preco: 85, unidade: 'frasco' },
      {
        nome: 'Master LP 4% 1L - Ourofino Saúde Animal',
        especie: '',
        preco: 210,
        unidade: 'frasco',
        detalhe: 'Ivermectina 4% (1ml/50kg). Endectocida de longa ação para bovinos. Proíbe abate por 133 dias após aplicação.'
      },
    ],
  },
  {
    nome: 'AgroNutri',
    descricao: 'Nutrição animal para períodos críticos e suplementação.',
    itens: [
      { nome: 'BOI SECA (Saco com 30kg.)', especie: '', preco: 272.20, unidade: 'saco', detalhe: 'Indicado para bovinos de corte em crescimento (recria) e adultos (manutenção de escore corporal) em pastagem no período seco do ano.' },
      { nome: 'Fosbovi® Semiconfinamento 10 (Saco 25 kgs.)', especie: '', preco: 111.53, unidade: 'saco', detalhe: 'Suplemento vitamínico, mineral com ureia e aditivos para bovinos de corte.' },
      { nome: 'Sal Proteinado (Saco de 30 kg)', especie: '', preco: 120.00, unidade: 'saco', detalhe: 'Essencial para evitar a perda de peso do gado na seca. O preço varia com o teor de proteína.' },
    ],
  },
];

import { useEffect } from 'react';
function ModalLoja({ aberta, loja, carrinho, setCarrinho, onFechar, onVerCarrinho }) {
  const [quantidades, setQuantidades] = useState({});
  useEffect(() => {
    if (!aberta) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onFechar();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [aberta, onFechar]);
  if (!aberta || !loja) return null;

  const adicionarAoCarrinho = (item) => {
    const qtd = Number(quantidades[item.nome]) || 1;
    setCarrinho([...carrinho, { ...item, quantidade: qtd }]);
    setQuantidades(q => ({ ...q, [item.nome]: 1 }));
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#23272f', borderRadius: 12, padding: 32, minWidth: 340, maxWidth: 480, boxShadow: '0 2px 16px #0006', position: 'relative' }}>
        <button onClick={onFechar} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h3 style={{ color: '#90caf9', marginBottom: 16 }}>{loja.nome}</h3>
        <div style={{ marginBottom: 18, color: '#b0bec5' }}>{loja.descricao}</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {loja.itens.map(item => (
            <li key={item.nome} style={{ marginBottom: 14, background: '#1a202c', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{item.nome} <span style={{ color: '#b0bec5', fontSize: 13 }}>({item.especie})</span></div>
              <div style={{ fontSize: 13, color: '#b0bec5' }}>Custo: <b>R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</b> / {item.unidade} {item.detalhe && <span style={{ color: '#facc15' }}>• {item.detalhe}</span>}</div>
              <div style={{ marginTop: 6 }}>
                <input type="number" min={1} value={quantidades[item.nome] || 1} onChange={e => setQuantidades(q => ({ ...q, [item.nome]: e.target.value }))} style={{ width: 60, marginRight: 8 }} />
                <button onClick={() => adicionarAoCarrinho(item)} style={{ background: '#4ade80', color: '#23272f', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 600, cursor: 'pointer' }}>Adicionar ao carrinho</button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={onVerCarrinho} style={{ marginTop: 18, background: '#90caf9', color: '#23272f', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
          Ver Carrinho ({carrinho.length})
        </button>
      </div>
    </div>
  );
}

function ModalCarrinho({ aberta, carrinho, onFechar, onFinalizar, loja }) {
  useEffect(() => {
    if (!aberta) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onFechar();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [aberta, onFechar]);
  if (!aberta) return null;
  const total = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#23272f', borderRadius: 12, padding: 32, minWidth: 340, maxWidth: 480, boxShadow: '0 2px 16px #0006', position: 'relative' }}>
        <button onClick={onFechar} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h3 style={{ color: '#90caf9', marginBottom: 16 }}>Carrinho - {loja?.nome}</h3>
        {carrinho.length === 0 ? <div style={{ color: '#b0bec5' }}>Seu carrinho está vazio.</div> : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {carrinho.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 10, background: '#1a202c', borderRadius: 8, padding: 10 }}>
                  <b>{item.nome}</b> ({item.quantidade} x R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / {item.unidade})
                </li>
              ))}
            </ul>
            <div style={{ margin: '18px 0', color: '#fff', fontWeight: 700 }}>Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <button onClick={onFinalizar} style={{ background: '#4ade80', color: '#23272f', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Finalizar Compra</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function LojasAgropecuaria() {
  // Cada loja tem seu próprio carrinho
  const [modalLoja, setModalLoja] = useState(null);
  const [carrinhos, setCarrinhos] = useState({}); // { [lojaNome]: [itens] }
  const [modalCarrinho, setModalCarrinho] = useState({ aberta: false, loja: null });
  const [saldo, setSaldo] = useState(15000); // Simulação local

  const abrirModalLoja = (loja) => setModalLoja(loja);
  const fecharModalLoja = () => setModalLoja(null);

  const setCarrinhoLoja = (lojaNome, itens) => {
    setCarrinhos(prev => ({ ...prev, [lojaNome]: itens }));
  };

  const verCarrinhoLoja = (loja) => {
    setModalCarrinho({ aberta: true, loja });
    setModalLoja(null);
  };

  const finalizarCompra = async () => {
    const loja = modalCarrinho.loja;
    const carrinho = carrinhos[loja.nome] || [];
    const total = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
    if (total > saldo) {
      alert('Saldo insuficiente para esta compra!');
      return;
    }
    // Lançar despesa no financeiro
    await lancarDespesa({
      descricao: `Compra em ${loja.nome}`,
      valor: total,
      categoria: 'Lojas Agropecuárias',
      data: new Date().toISOString().slice(0, 10),
      status: 'Paga',
      obs: carrinho.map(i => `${i.quantidade}x ${i.nome}`).join(', '),
    });
    setSaldo(s => s - total);
    setCarrinhoLoja(loja.nome, []);
    setModalCarrinho({ aberta: false, loja: null });
    alert('Compra finalizada! Os itens foram enviados para o seu inventário e a despesa registrada no financeiro.');
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ marginBottom: 8 }}>Lojas de Agropecuária</h2>
      <div style={{ marginBottom: 24, color: '#b0bec5' }}>Clique em uma loja para ver os produtos disponíveis e adicionar ao carrinho. Saldo disponível: <b style={{ color: saldo < 0 ? '#e53935' : '#00e676' }}>R$ {saldo.toLocaleString('pt-BR')}</b></div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
        {LOJAS.map(loja => (
          <div key={loja.nome} style={{ position: 'relative' }}>
            <LojaAgropecuariaCard nome={loja.nome} descricao={loja.descricao} onClick={() => abrirModalLoja(loja)} />
            <button onClick={() => verCarrinhoLoja(loja)} style={{ position: 'absolute', top: 12, right: 12, background: '#90caf9', color: '#23272f', border: 'none', borderRadius: 8, padding: '4px 12px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Carrinho ({(carrinhos[loja.nome]?.length || 0)})
            </button>
          </div>
        ))}
      </div>
      <ModalLoja
        aberta={!!modalLoja}
        loja={modalLoja}
        carrinho={carrinhos[modalLoja?.nome] || []}
        setCarrinho={itens => setCarrinhoLoja(modalLoja.nome, itens)}
        onFechar={fecharModalLoja}
        onVerCarrinho={() => verCarrinhoLoja(modalLoja)}
      />
      <ModalCarrinho
        aberta={modalCarrinho.aberta}
        carrinho={modalCarrinho.loja ? (carrinhos[modalCarrinho.loja.nome] || []) : []}
        onFechar={() => setModalCarrinho({ aberta: false, loja: null })}
        onFinalizar={finalizarCompra}
        loja={modalCarrinho.loja}
      />
    </div>
  );
}