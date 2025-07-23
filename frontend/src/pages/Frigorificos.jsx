import { useState, useEffect } from 'react';
import frigorificos from '../data/frigorificos.json';
import FrigorificoCard from '../components/FrigorificoCard';
import { getPrecoArroba } from '../api/arrobaService';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function Frigorificos() {
  const [selecionado, setSelecionado] = useState(null);
  const [precoArroba, setPrecoArroba] = useState(null);
  const [evolucaoPreco, setEvolucaoPreco] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simula data do jogo (poderia vir do contexto global)
  const [dataJogo, setDataJogo] = useState(() => {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  });

  // Busca o preço da arroba calculado
  useEffect(() => {
    async function fetchPreco() {
      setLoading(true);
      try {
        const data = await getPrecoArroba();
        // Supondo que o backend já retorna o preço convertido (BRL/@)
        setPrecoArroba(data.preco_arroba_brl || 0);
        setEvolucaoPreco(prev => ([...prev, { data: dataJogo, preco: data.preco_arroba_brl || 0 }]));
      } catch {
        setPrecoArroba(null);
      }
      setLoading(false);
    }
    fetchPreco();
    // eslint-disable-next-line
  }, [dataJogo]);

  // Simula avanço do tempo do jogo a cada 5s (para demo)
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      d.setDate(d.getDate() + evolucaoPreco.length + 1);
      setDataJogo(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [evolucaoPreco]);

  return (
    <div>
      <div style={{ marginBottom: 32, background: '#23272f', borderRadius: 12, padding: 24 }}>
        <h3 style={{ color: '#1976d2', margin: 0, marginBottom: 16 }}>Evolução do Preço da Arroba (R$)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={evolucaoPreco} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="data" stroke="#b0bec5" />
            <YAxis stroke="#b0bec5" domain={['auto', 'auto']} />
            <Tooltip formatter={v => `R$ ${v.toLocaleString('pt-BR', {minimumFractionDigits:2})}`} labelStyle={{color:'#1976d2'}}/>
            <Line type="monotone" dataKey="preco" stroke="#1976d2" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {frigorificos.map(f => (
          <FrigorificoCard key={f.id} frigorifico={{...f, preco_arroba: precoArroba}} onSelecionar={() => setSelecionado(f.id)} />
        ))}
      </div>
      {selecionado && (
        <div style={{ marginTop: 32, background: '#181a1f', borderRadius: 8, padding: 24, color: '#fff' }}>
          <b>Funcionalidade de seleção de animais e envio para frigorífico em desenvolvimento.</b>
        </div>
      )}
    </div>
  );
}

export default Frigorificos; 