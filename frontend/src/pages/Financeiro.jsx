import { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

import { getReceitas, getDespesas, getFazendasJogador, getDRE } from '../api/financeiroService';




function getMonthYear(dateStr) {
  // dateStr: '2025-07-10' => '2025-07'
  return dateStr ? dateStr.slice(0, 7) : '';
}


function Financeiro() {
  // Definição das abas (mantendo o layout original)
  const ABAS = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'receitas', label: 'RECEITAS' },
    { id: 'despesas', label: 'DESPESAS' },
    { id: 'fluxo', label: 'FLUXO DE CAIXA' },
    { id: 'dre', label: 'DRE' },
  ];
  const [aba, setAba] = useState('dashboard');
  const [dataInicial, setDataInicial] = useState('2025-07-01');
  const [dataFinal, setDataFinal] = useState('2025-07-31');
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [status, setStatus] = useState('Todas');
  const [buscaDesp, setBuscaDesp] = useState('');
  const [categoriaDesp, setCategoriaDesp] = useState('');
  const [statusDesp, setStatusDesp] = useState('Todas');
  const [dataInicialDesp, setDataInicialDesp] = useState('2025-07-01');
  const [dataFinalDesp, setDataFinalDesp] = useState('2025-07-31');
  const [dataInicialFluxo, setDataInicialFluxo] = useState('2025-07-01');
  const [dataFinalFluxo, setDataFinalFluxo] = useState('2025-07-31');
  const [mesAno, setMesAno] = useState('2025-07');
  const [fazendaDre, setFazendaDre] = useState('todas');

  // Dados vindos do backend
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [fazendasJogador, setFazendasJogador] = useState([]);
  const [dreCategorias, setDreCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CATEGORIAS dinâmicas (todas categorias encontradas em receitas e despesas)
  const CATEGORIAS = Array.from(new Set([
    ...receitas.map(r => r.categoria),
    ...despesas.map(d => d.categoria)
  ].filter(Boolean)));

  // Função para carregar dados financeiros
  const carregarDadosFinanceiros = () => {
    setLoading(true);
    Promise.all([
      getReceitas(),
      getDespesas(),
      getFazendasJogador(),
      getDRE()
    ])
      .then(([receitasData, despesasData, fazendasData, dreData]) => {
        setReceitas(Array.isArray(receitasData) ? receitasData : (receitasData.receitas || []));
        setDespesas(Array.isArray(despesasData) ? despesasData : (despesasData.despesas || []));
        setFazendasJogador(Array.isArray(fazendasData) ? fazendasData : (fazendasData.fazendas_jogador || []));
        setDreCategorias(Array.isArray(dreData) ? dreData : (dreData.dre_categorias || []));
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao buscar dados financeiros do backend');
        setLoading(false);
      });
  };

  // Carrega dados na montagem do componente
  useEffect(() => {
    carregarDadosFinanceiros();
  }, []);

  // Atualiza dados a cada 5 segundos para capturar novas vendas
  useEffect(() => {
    const interval = setInterval(() => {
      carregarDadosFinanceiros();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);


  // Filtros e KPIs de receitas (apenas dados reais)
  const receitasFiltradas = receitas.filter(r => {
    const dataOk = (!dataInicial || r.data >= dataInicial) && (!dataFinal || r.data <= dataFinal);
    const buscaOk = !busca || r.descricao?.toLowerCase().includes(busca.toLowerCase());
    const categoriaOk = !categoria || r.categoria === categoria;
    const statusOk = status === 'Todas' || r.status === status;
    return dataOk && buscaOk && categoriaOk && statusOk;
  });
  const totalRecebido = receitasFiltradas.filter(r => r.status === 'Recebida').reduce((acc, r) => acc + r.valor, 0);
  const totalAReceber = receitasFiltradas.filter(r => r.status === 'A Receber').reduce((acc, r) => acc + r.valor, 0);
  const totalReceitas = receitasFiltradas.reduce((acc, r) => acc + r.valor, 0);

  // Filtros e KPIs de despesas (apenas dados reais)
  const despesasFiltradas = despesas.filter(d => {
    const dataOk = (!dataInicialDesp || d.vencimento >= dataInicialDesp) && (!dataFinalDesp || d.vencimento <= dataFinalDesp);
    const buscaOk = !buscaDesp || d.descricao?.toLowerCase().includes(buscaDesp.toLowerCase());
    const categoriaOk = !categoriaDesp || d.categoria === categoriaDesp;
    const statusOk = statusDesp === 'Todas' || d.status === statusDesp;
    return dataOk && buscaOk && categoriaOk && statusOk;
  });
  const totalPago = despesasFiltradas.filter(d => d.status === 'Paga').reduce((acc, d) => acc + d.valor, 0);
  const totalAPagar = despesasFiltradas.filter(d => d.status === 'A Pagar').reduce((acc, d) => acc + d.valor, 0);
  const totalDespesas = despesasFiltradas.reduce((acc, d) => acc + d.valor, 0);

  // Gráfico de pizza de despesas por categoria (apenas dados reais)
  const despesasPorCategoria = despesasFiltradas.reduce((acc, d) => {
    if (!acc[d.categoria]) acc[d.categoria] = 0;
    acc[d.categoria] += d.valor;
    return acc;
  }, {});
  const pieLabels = Object.keys(despesasPorCategoria);
  const pieData = Object.values(despesasPorCategoria);
  const pieColors = [
    '#e53935', '#1976d2', '#00e676', '#e6c200', '#8e24aa', '#ff7043', '#43a047', '#fbc02d', '#3949ab', '#00838f'
  ];
  const pieChartData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieData,
        backgroundColor: pieColors.slice(0, pieLabels.length),
        borderWidth: 1,
      },
    ],
  };

  // FLUXO DE CAIXA (apenas dados reais)
  const receitasFluxo = receitas.filter(r => r.data >= dataInicialFluxo && r.data <= dataFinalFluxo && r.status === 'Recebida');
  const despesasFluxo = despesas.filter(d => d.vencimento >= dataInicialFluxo && d.vencimento <= dataFinalFluxo && d.status === 'Paga');
  const totalReceitasFluxo = receitasFluxo.reduce((acc, r) => acc + r.valor, 0);
  const totalDespesasFluxo = despesasFluxo.reduce((acc, d) => acc + d.valor, 0);
  const saldoLiquido = totalReceitasFluxo - totalDespesasFluxo;
  const datasSet = new Set([
    ...receitasFluxo.map(r => r.data),
    ...despesasFluxo.map(d => d.vencimento)
  ]);
  const datas = Array.from(datasSet).sort();
  let subtotal = 0;
  const movimentacoes = datas.map(data => {
    const receitasDia = receitasFluxo.filter(r => r.data === data).reduce((acc, r) => acc + r.valor, 0);
    const despesasDia = despesasFluxo.filter(d => d.vencimento === data).reduce((acc, d) => acc + d.valor, 0);
    subtotal += receitasDia - despesasDia;
    return {
      data,
      receitas: receitasDia,
      despesas: despesasDia,
      subtotal: subtotal
    };
  });

  // DRE (apenas dados reais)
  const totalReceitaDre = dreCategorias.reduce((acc, c) => acc + (c.receita || 0), 0);
  const totalDespesaDre = dreCategorias.reduce((acc, c) => acc + (c.despesa || 0), 0);
  const lucroLiquido = totalReceitaDre - totalDespesaDre;

  // KPIs reais do dashboard
  const saldoAtual = receitas.reduce((acc, r) => acc + (r.status === 'Recebida' ? r.valor : 0), 0)
    - despesas.reduce((acc, d) => acc + (d.status === 'Paga' ? d.valor : 0), 0);
  const receitasMes = receitas.filter(r => getMonthYear(r.data) === mesAno && r.status === 'Recebida').reduce((acc, r) => acc + r.valor, 0);
  const despesasMes = despesas.filter(d => getMonthYear(d.vencimento) === mesAno && d.status === 'Paga').reduce((acc, d) => acc + d.valor, 0);

  // Gráfico de barras: Receitas vs. Despesas por mês
  // Agrupa receitas e despesas por mês/ano (YYYY-MM)
  const mesesSet = new Set([
    ...receitas.map(r => getMonthYear(r.data)),
    ...despesas.map(d => getMonthYear(d.vencimento))
  ]);
  const meses = Array.from(mesesSet).filter(Boolean).sort();
  const receitasPorMes = meses.map(m => receitas.filter(r => getMonthYear(r.data) === m).reduce((acc, r) => acc + r.valor, 0));
  const despesasPorMes = meses.map(m => despesas.filter(d => getMonthYear(d.vencimento) === m).reduce((acc, d) => acc + d.valor, 0));
  const barChartData = {
    labels: meses,
    datasets: [
      {
        label: 'Receitas',
        data: receitasPorMes,
        backgroundColor: '#1976d2',
        borderRadius: 6,
      },
      {
        label: 'Despesas',
        data: despesasPorMes,
        backgroundColor: '#e53935',
        borderRadius: 6,
      },
    ],
  };
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#b0bec5', font: { size: 14 } },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: R$ ${value.toLocaleString('pt-BR')}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#b0bec5' },
        grid: { color: '#313640' },
      },
      y: {
        ticks: { color: '#b0bec5' },
        grid: { color: '#313640' },
      },
    },
  };

  if (loading) return <div style={{ color: '#b0bec5', padding: 32 }}>Carregando dados financeiros...</div>;
  if (error) return <div style={{ color: '#e53935', padding: 32 }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {ABAS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setAba(tab.id)}
            style={{
              padding: '10px 24px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: aba === tab.id ? '#1976d2' : '#23272f',
              color: aba === tab.id ? '#fff' : '#b0bec5',
              fontWeight: aba === tab.id ? 700 : 500,
              fontSize: '1rem',
              boxShadow: aba === tab.id ? '0 2px 8px rgba(25,118,210,0.10)' : 'none',
              cursor: 'pointer',
              borderBottom: aba === tab.id ? '2px solid #1976d2' : '2px solid transparent',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ background: '#23272f', borderRadius: 12, padding: 32, minHeight: 200 }}>
        {aba === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 24, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Saldo Atual</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#00e676' }}>R$ {saldoAtual.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 24, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Receitas do Mês</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#1976d2' }}>R$ {receitasMes.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 24, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Despesas do Mês (pagas)</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#e53935' }}>R$ {despesasMes.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'end', gap: 12 }}>
                <button 
                  onClick={carregarDadosFinanceiros}
                  style={{ padding: '12px 20px', borderRadius: 8, background: '#00e676', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 16 }}
                >
                  🔄 Atualizar Dados
                </button>
                <button style={{ padding: '12px 20px', borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 16 }}>
                  Cadastrar Categorias
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 320px', minWidth: 320, maxWidth: 480, background: '#181a1f', borderRadius: 12, padding: 24 }}>
                <div style={{ marginBottom: 12, fontWeight: 600 }}>Despesas por Categoria</div>
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0bec5', background: '#23272f', borderRadius: 8 }}>
                  {pieLabels.length > 0 ? (
                    <Pie
                      data={pieChartData}
                      options={{
                        plugins: {
                          legend: {
                            labels: { color: '#b0bec5', font: { size: 14 } },
                            position: 'right',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: R$ ${value.toLocaleString('pt-BR')}`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <span style={{ color: '#b0bec5' }}>[Sem dados de despesas]</span>
                  )}
                </div>
              </div>
              <div style={{ flex: '2 1 480px', minWidth: 320, background: '#181a1f', borderRadius: 12, padding: 24 }}>
                <div style={{ marginBottom: 12, fontWeight: 600 }}>Receitas vs. Despesas</div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <label>
                    Data Inicial:
                    <input type="date" value={dataInicial} onChange={e => setDataInicial(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
                  </label>
                  <label>
                    Data Final:
                    <input type="date" value={dataFinal} onChange={e => setDataFinal(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
                  </label>
                </div>
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0bec5', background: '#23272f', borderRadius: 8 }}>
                  {meses.length > 0 ? (
                    <Bar
                      data={barChartData}
                      options={barChartOptions}
                    />
                  ) : (
                    <span style={{ color: '#b0bec5' }}>[Sem dados de receitas/despesas]</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {aba === 'receitas' && (
          <div>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
              <label>
                Data Inicial:
                <input type="date" value={dataInicial} onChange={e => setDataInicial(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
              </label>
              <label>
                Data Final:
                <input type="date" value={dataFinal} onChange={e => setDataFinal(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
              </label>
              <label>
                Buscar Receitas:
                <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Descrição..." style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
              </label>
              <label>
                Categoria:
                <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }}>
                  <option value="">Todas</option>
                  {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </label>
              <label>
                Status:
                <select value={status} onChange={e => setStatus(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }}>
                  <option value="Todas">Todas</option>
                  <option value="Recebida">Recebidas</option>
                  <option value="A Receber">A Receber</option>
                </select>
              </label>
            </div>
            {/* KPIs */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 24 }}>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 20, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Total Recebido</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#00e676' }}>R$ {totalRecebido.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 20, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Total a Receber</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#e6c200' }}>R$ {totalAReceber.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 20, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Total de Receitas</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1976d2' }}>R$ {totalReceitas.toLocaleString('pt-BR')}</div>
              </div>
            </div>
            {/* Lista de Receitas */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#181a1f', borderRadius: 8 }}>
                <thead>
                  <tr style={{ background: '#23272f', color: '#b0bec5' }}>
                    <th style={{ padding: 10, textAlign: 'left' }}>Descrição</th>
                    <th style={{ padding: 10, textAlign: 'right' }}>Valor</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Data</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Categoria</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Status</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {receitasFiltradas.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#b0bec5', padding: 24 }}>Nenhuma receita encontrada.</td>
                    </tr>
                  )}
                  {receitasFiltradas.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #23272f' }}>
                      <td style={{ padding: 10 }}>{r.descricao}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: '#00e676', fontWeight: 600 }}>R$ {r.valor.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{r.data}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{r.categoria}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{r.status}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{r.obs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {aba === 'despesas' && (
          <div>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
              <label>
                Data Inicial:
                <input type="date" value={dataInicialDesp} onChange={e => setDataInicialDesp(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
              </label>
              <label>
                Data Final:
                <input type="date" value={dataFinalDesp} onChange={e => setDataFinalDesp(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
              </label>
              <label>
                Buscar Despesas:
                <input type="text" value={buscaDesp} onChange={e => setBuscaDesp(e.target.value)} placeholder="Descrição..." style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
              </label>
              <label>
                Categoria:
                <select value={categoriaDesp} onChange={e => setCategoriaDesp(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }}>
                  <option value="">Todas</option>
                  {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </label>
              <label>
                Status:
                <select value={statusDesp} onChange={e => setStatusDesp(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }}>
                  <option value="Todas">Todas</option>
                  <option value="Paga">Pagas</option>
                  <option value="A Pagar">A Pagar</option>
                </select>
              </label>
            </div>
            {/* KPIs */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 24 }}>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 20, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Total Pago</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#00e676' }}>R$ {totalPago.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 20, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Total a Pagar</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#e6c200' }}>R$ {totalAPagar.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 20, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Total de Despesas</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#e53935' }}>R$ {totalDespesas.toLocaleString('pt-BR')}</div>
              </div>
            </div>
            {/* Lista de Despesas */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#181a1f', borderRadius: 8 }}>
                <thead>
                  <tr style={{ background: '#23272f', color: '#b0bec5' }}>
                    <th style={{ padding: 10, textAlign: 'left' }}>Descrição</th>
                    <th style={{ padding: 10, textAlign: 'right' }}>Valor</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Vencimento</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Categoria</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Status</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {despesasFiltradas.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#b0bec5', padding: 24 }}>Nenhuma despesa encontrada.</td>
                    </tr>
                  )}
                  {despesasFiltradas.map(d => (
                    <tr key={d.id} style={{ borderBottom: '1px solid #23272f' }}>
                      <td style={{ padding: 10 }}>{d.descricao}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: '#e53935', fontWeight: 600 }}>R$ {d.valor.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{d.vencimento}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{d.categoria}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{d.status}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{d.obs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {aba === 'fluxo' && (
          <div>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
              <label>
                Data Inicial:
                <input type="date" value={dataInicialFluxo} onChange={e => setDataInicialFluxo(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
              </label>
              <label>
                Data Final:
                <input type="date" value={dataFinalFluxo} onChange={e => setDataFinalFluxo(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
              </label>
            </div>
            {/* KPIs */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 24 }}>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 20, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Total de Receitas</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1976d2' }}>R$ {totalReceitasFluxo.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 20, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Total de Despesas</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#e53935' }}>R$ {totalDespesasFluxo.toLocaleString('pt-BR')}</div>
              </div>
              <div style={{ background: '#181a1f', borderRadius: 8, padding: 20, minWidth: 180 }}>
                <div style={{ color: '#b0bec5', fontSize: 14 }}>Saldo Líquido</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: saldoLiquido >= 0 ? '#00e676' : '#e53935' }}>R$ {saldoLiquido.toLocaleString('pt-BR')}</div>
              </div>
            </div>
            {/* Movimentações por Data */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#181a1f', borderRadius: 8 }}>
                <thead>
                  <tr style={{ background: '#23272f', color: '#b0bec5' }}>
                    <th style={{ padding: 10, textAlign: 'center' }}>Data</th>
                    <th style={{ padding: 10, textAlign: 'right' }}>Receitas</th>
                    <th style={{ padding: 10, textAlign: 'right' }}>Despesas</th>
                    <th style={{ padding: 10, textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {movimentacoes.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#b0bec5', padding: 24 }}>Nenhuma movimentação encontrada.</td>
                    </tr>
                  )}
                  {movimentacoes.map((m, idx) => (
                    <tr key={m.data} style={{ borderBottom: '1px solid #23272f' }}>
                      <td style={{ padding: 10, textAlign: 'center' }}>{m.data}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: '#1976d2', fontWeight: 600 }}>R$ {m.receitas.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: '#e53935', fontWeight: 600 }}>R$ {m.despesas.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: m.subtotal >= 0 ? '#00e676' : '#e53935', fontWeight: 700 }}>R$ {m.subtotal.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {aba === 'dre' && (
          <div>
            {/* Explicação */}
            <div style={{ marginBottom: 16, background: '#181a1f', borderRadius: 8, padding: 20, color: '#b0bec5' }}>
              <b>DRE (Demonstrativo de Resultado do Exercício):</b> O DRE apresenta o resultado financeiro consolidado do período selecionado, considerando apenas as fazendas de sua propriedade. Use os filtros abaixo para analisar receitas, despesas e lucro líquido por mês e por fazenda.
            </div>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
              <label>
                Mês/Ano:
                <input type="month" value={mesAno} onChange={e => setMesAno(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }} />
              </label>
              <label>
                Fazenda:
                <select value={fazendaDre} onChange={e => setFazendaDre(e.target.value)} style={{ marginLeft: 8, background: '#23272f', color: '#fff', border: '1px solid #313640', borderRadius: 4, padding: '4px 8px' }}>
                  <option value="todas">Todas as Fazendas</option>
                  {fazendasJogador.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                </select>
              </label>
            </div>
            {/* Tabela DRE */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#181a1f', borderRadius: 8 }}>
                <thead>
                  <tr style={{ background: '#23272f', color: '#b0bec5' }}>
                    <th style={{ padding: 10, textAlign: 'left' }}>Categoria</th>
                    <th style={{ padding: 10, textAlign: 'right' }}>Receita</th>
                    <th style={{ padding: 10, textAlign: 'right' }}>Despesa</th>
                    <th style={{ padding: 10, textAlign: 'right' }}>Lucro Líquido</th>
                  </tr>
                </thead>
                <tbody>
                  {dreCategorias.map((c, idx) => (
                    <tr key={c.categoria} style={{ borderBottom: '1px solid #23272f' }}>
                      <td style={{ padding: 10 }}>{c.categoria}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: '#1976d2', fontWeight: 600 }}>R$ {c.receita.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: '#e53935', fontWeight: 600 }}>R$ {c.despesa.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: 10, textAlign: 'right', color: (c.receita - c.despesa) >= 0 ? '#00e676' : '#e53935', fontWeight: 700 }}>R$ {(c.receita - c.despesa).toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                  {/* Total */}
                  <tr style={{ background: '#23272f', fontWeight: 700 }}>
                    <td style={{ padding: 10 }}>TOTAL</td>
                    <td style={{ padding: 10, textAlign: 'right', color: '#1976d2' }}>R$ {totalReceitaDre.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: 10, textAlign: 'right', color: '#e53935' }}>R$ {totalDespesaDre.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: 10, textAlign: 'right', color: lucroLiquido >= 0 ? '#00e676' : '#e53935' }}>R$ {lucroLiquido.toLocaleString('pt-BR')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Financeiro;