
import InstituicaoFinanceiraCard from '../components/InstituicaoFinanceiraCard';
import { registrarEmprestimo, registrarParcelaEmprestimo } from '../api/financeiroService';

// MOCK: Score do produtor (0-1000)
const scoreRural = 780;
const scoreDescricao = scoreRural >= 900 ? 'Excelente' : scoreRural >= 750 ? 'Muito Bom' : scoreRural >= 600 ? 'Bom' : scoreRural >= 400 ? 'Regular' : 'Baixo';

const instituicoes = [
  {
    nome: 'Banco do Agro Nacional (BAN)',
    tipo: 'Banco Público',
    linhasCredito: ['Pronaf', 'Pronamp', 'Investimento', 'Custeio'],
    taxas: 'Controladas (subsidiadas) e livres',
    vantagens: 'Limites altos, taxas baixas para pequenos e médios, presença nacional',
    requisitos: 'Laudo técnico, garantias reais, regularidade ambiental/fiscal',
    logo: undefined,
  },
  {
    nome: 'Banco Terra Forte',
    tipo: 'Banco Privado',
    linhasCredito: ['Comercialização', 'Industrialização', 'Custeio'],
    taxas: 'Livres (atreladas à Selic), spread competitivo',
    vantagens: 'Atendimento digital, crédito rápido, foco em grandes volumes',
    requisitos: 'Garantias robustas, aval, análise de risco',
    logo: undefined,
  },
  {
    nome: 'Banco Rural Mais',
    tipo: 'Banco Regional',
    linhasCredito: ['Custeio', 'Investimento', 'Modernização'],
    taxas: 'Intermediárias, análise personalizada',
    vantagens: 'Atendimento próximo, programas próprios, visitas técnicas',
    requisitos: 'Experiência, regularidade ambiental/fiscal',
    logo: undefined,
  },
  {
    nome: 'Cooperativa AgroUnidos',
    tipo: 'Cooperativa de Crédito',
    linhasCredito: ['Custeio', 'Investimento', 'Comercialização'],
    taxas: 'Menores nas linhas livres, distribuição de sobras',
    vantagens: 'Taxas competitivas, participação nos lucros, projetos coletivos',
    requisitos: 'Participação ativa, garantias proporcionais',
    logo: undefined,
  },
];

import React, { useState } from 'react';

function ModalSolicitarEmprestimo({ aberta, instituicao, onFechar, onSalvarSolicitacao }) {
  const [valor, setValor] = useState('');
  const [linha, setLinha] = useState(instituicao?.linhasCredito?.[0] || '');
  const [parcelas, setParcelas] = useState(12);
  const [feedback, setFeedback] = useState('');
  if (!aberta || !instituicao) return null;

  // Simulação simples: taxa base 1,2% ao mês, ajustada por score fictício
  const taxaMes = 0.012;
  const valorNum = parseFloat(valor) || 0;
  const valorParcela = valorNum > 0 ? (valorNum * taxaMes * Math.pow(1 + taxaMes, parcelas)) / (Math.pow(1 + taxaMes, parcelas) - 1) : 0;
  const totalPago = valorParcela * parcelas;

  const handleSolicitar = () => {
    if (!valorNum || valorNum < 1000) {
      setFeedback('Informe um valor acima de R$ 1.000,00');
      return;
    }
    setFeedback('Solicitação enviada! Aguarde análise da instituição.');
    if (onSalvarSolicitacao) {
      onSalvarSolicitacao({ instituicao, linha, valor: valorNum, parcelas });
    }
    setTimeout(() => {
      setFeedback('');
      onFechar();
    }, 2000);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#23272f', borderRadius: 16, padding: 40, minWidth: 420, maxWidth: 520, boxShadow: '0 4px 32px #0008', position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button onClick={onFechar} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h3 style={{ color: '#90caf9', marginBottom: 8 }}>Solicitar Empréstimo - {instituicao.nome}</h3>
        <div style={{ color: '#b0bec5', marginBottom: 4 }}>SCORE RURAL: <b style={{ color: '#fff' }}>780</b> <span style={{ color: '#b0bec5', fontWeight: 500, fontSize: 15 }}>(Muito Bom)</span></div>
        <div style={{ color: '#b0bec5', marginBottom: 4 }}>Linhas de Crédito:
          <select value={linha} onChange={e => setLinha(e.target.value)} style={{ marginLeft: 8, background: '#181a1f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }}>
            {instituicao.linhasCredito.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div style={{ color: '#b0bec5', marginBottom: 4 }}>Taxas: {instituicao.taxas}</div>
        <input type="number" placeholder="Valor desejado (R$)" value={valor} onChange={e => setValor(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #313640', background: '#181a1f', color: '#fff', fontSize: 16 }} />
        <div style={{ color: '#b0bec5', marginBottom: 4 }}>
          Parcelas:
          <select value={parcelas} onChange={e => setParcelas(Number(e.target.value))} style={{ marginLeft: 8, background: '#181a1f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }}>
            {[6, 12, 18, 24, 36, 48].map(p => <option key={p} value={p}>{p}x</option>)}
          </select>
        </div>
        {valorNum > 0 && (
          <div style={{ color: '#00e676', fontWeight: 600, marginBottom: 4 }}>
            Simulação: {parcelas}x de R$ {valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span style={{ color: '#b0bec5', fontWeight: 400 }}>(Total: R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</span>
          </div>
        )}
        <button onClick={handleSolicitar} style={{ background: '#4ade80', color: '#23272f', border: 'none', borderRadius: 6, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 12 }}>Solicitar</button>
        {feedback && <div style={{ color: feedback.startsWith('Solicitação') ? '#4ade80' : '#eab308', fontWeight: 600, marginTop: 8 }}>{feedback}</div>}
      </div>
    </div>
  );
}

function BancosCooperativas() {
  const [modal, setModal] = useState({ aberta: false, instituicao: null });
  const [historico, setHistorico] = useState([]);
  // Lógica realista: SCORE, valor, linha de crédito
  const handleSalvarSolicitacao = async (dados) => {
    const id = Date.now();
    const score = scoreRural; // Poderia ser dinâmico por fazenda/jogador
    let aprovado = false;
    let motivo = '';
    
    // Limites e regras por linha de crédito
    const limites = {
      'Pronaf': 80000,
      'Pronamp': 200000,
      'Investimento': 300000,
      'Custeio': 150000,
      'Comercialização': 120000,
      'Industrialização': 180000,
      'Modernização': 100000,
    };
    const limiteLinha = limites[dados.linha] || 100000;
    
    // SCORE influencia limite e aprovação
    if (score < 400) {
      aprovado = false;
      motivo = 'Score Rural muito baixo';
    } else if (dados.valor > limiteLinha) {
      aprovado = false;
      motivo = 'Valor acima do limite para esta linha de crédito';
    } else if (score < 600 && dados.valor > 50000) {
      aprovado = false;
      motivo = 'Score insuficiente para valor solicitado';
    } else {
      aprovado = true;
    }
    
    const novaSolicitacao = {
      ...dados,
      id,
      data: new Date().toLocaleString('pt-BR'),
      status: 'Em análise',
      motivoRecusa: ''
    };
    setHistorico(h => [...h, novaSolicitacao]);
    
    setTimeout(async () => {
      if (aprovado) {
        try {
          // Registra o empréstimo como receita no financeiro
          const taxaMes = 0.012; // 1,2% ao mês
          await registrarEmprestimo({
            instituicao: dados.instituicao.nome,
            valor: dados.valor,
            linha: dados.linha,
            parcelas: dados.parcelas,
            taxaMes: taxaMes
          });
          
          // Registra as parcelas como despesas futuras
          const valorParcela = (dados.valor * taxaMes * Math.pow(1 + taxaMes, dados.parcelas)) / (Math.pow(1 + taxaMes, dados.parcelas) - 1);
          const dataAtual = new Date();
          
          for (let i = 1; i <= dados.parcelas; i++) {
            const dataVencimento = new Date(dataAtual);
            dataVencimento.setMonth(dataVencimento.getMonth() + i);
            
            await registrarParcelaEmprestimo({
              instituicao: dados.instituicao.nome,
              valorParcela: valorParcela,
              numeroParcela: i,
              totalParcelas: dados.parcelas,
              dataVencimento: dataVencimento.toISOString().slice(0, 10)
            });
          }
          
          console.log('✅ Empréstimo registrado no financeiro com sucesso!');
        } catch (error) {
          console.error('❌ Erro ao registrar empréstimo:', error);
        }
      }
      
      setHistorico(h => h.map(s =>
        s.id === id
          ? aprovado
            ? { ...s, status: 'Aprovado' }
            : { ...s, status: 'Recusado', motivoRecusa: motivo }
          : s
      ));
    }, 2000);
  };
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ marginBottom: 8 }}>Instituições Financeiras</h2>
      <div style={{ marginBottom: 24, fontSize: 18, fontWeight: 600, color: '#90caf9' }}>
        SCORE RURAL: <span style={{ color: '#fff', fontWeight: 800 }}>{scoreRural}</span> <span style={{ color: '#b0bec5', fontWeight: 500, fontSize: 15 }}>({scoreDescricao})</span>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {instituicoes.map(inst => (
          <InstituicaoFinanceiraCard key={inst.nome} {...inst} onSolicitarEmprestimo={inst => setModal({ aberta: true, instituicao: inst })} />
        ))}
      </div>
      <ModalSolicitarEmprestimo
        aberta={modal.aberta}
        instituicao={modal.instituicao}
        onFechar={() => setModal({ aberta: false, instituicao: null })}
        onSalvarSolicitacao={handleSalvarSolicitacao}
      />
      <div style={{ marginTop: 32, color: '#b0bec5', fontSize: 14, maxWidth: 700 }}>
        <b>O que é o SCORE RURAL?</b><br />
        O Score Rural é uma avaliação composta por histórico de crédito, análise técnica da propriedade, projeto de viabilidade, experiência do produtor, garantias apresentadas e regularidade ambiental/fiscal. Quanto maior o score, melhores as condições e limites de crédito junto às instituições financeiras.
      </div>
      {historico.length > 0 && (
        <div style={{ marginTop: 40, background: '#181a1f', borderRadius: 12, padding: 24, maxWidth: 700 }}>
          <h3 style={{ color: '#90caf9', marginBottom: 12 }}>Histórico de Solicitações</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {historico.map((h, i) => (
              <li key={h.id || i} style={{ marginBottom: 10, background: '#23272f', borderRadius: 8, padding: 12 }}>
                <b>{h.instituicao?.nome || h.nome}</b> - {h.linha} - R$ {Number(h.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em {h.parcelas}x
                <span style={{ color: '#b0bec5', marginLeft: 8 }}>{h.data}</span>
                <span style={{ color: h.status === 'Aprovado' ? '#4ade80' : h.status === 'Recusado' ? '#e53935' : '#facc15', marginLeft: 12 }}>{h.status}</span>
                {h.status === 'Recusado' && h.motivoRecusa && (
                  <span style={{ color: '#eab308', marginLeft: 12 }}>({h.motivoRecusa})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BancosCooperativas;