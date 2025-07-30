


import React, { useEffect, useState } from 'react';
import './CentraisSemen.css';
import { getDosesSemen } from '../api/centralSemenService';


import CarrinhoSemenModal from '../components/CarrinhoSemenModal';
import useCarrinhoSemenStore from '../state/useCarrinhoSemenStore';
import { lancarDespesa } from '../api/financeiroService';



function CentraisSemen() {
  const [doses, setDoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtradas, setFiltradas] = useState([]);

useEffect(() => {
  // Touros fixos por raça (sempre disponíveis)
  const tourosFixos = [
    // Angus Preto
    {
      id: 'angus1',
      nome: 'Black Titan',
      raca: 'Angus Preto',
      registro: 'ANG-001',
      cor: 'Preta',
      mocho: true,
      preco: 120,
      imagem: '/img/touros/angus1.jpg',
      descricao: 'Touro Angus Preto de alta performance, excelente marmoreio.'
    },
    {
      id: 'angus2',
      nome: 'Midnight King',
      raca: 'Angus Preto',
      registro: 'ANG-002',
      cor: 'Preta',
      mocho: true,
      preco: 110,
      imagem: '/img/touros/angus2.jpg',
      descricao: 'Genética Angus para precocidade e ganho de peso.'
    },
    // Angus Vermelho
    {
      id: 'angusv1',
      nome: 'Red Valor',
      raca: 'Angus Vermelho',
      registro: 'ANGV-001',
      cor: 'Vermelha',
      mocho: true,
      preco: 115,
      imagem: '/img/touros/angusv1.jpg',
      descricao: 'Touro Angus Vermelho, rusticidade e fertilidade.'
    },
    {
      id: 'angusv2',
      nome: 'Fire Prime',
      raca: 'Angus Vermelho',
      registro: 'ANGV-002',
      cor: 'Vermelha',
      mocho: true,
      preco: 112,
      imagem: '/img/touros/angusv2.jpg',
      descricao: 'Excelente marmoreio e adaptação ao calor.'
    },
    // Hereford
    {
      id: 'hereford1',
      nome: 'White Face',
      raca: 'Hereford Mocho',
      registro: 'HER-001',
      cor: 'Vermelha',
      mocho: true,
      preco: 105,
      imagem: '/img/touros/hereford1.jpg',
      descricao: 'Hereford Mocho, docilidade e fertilidade.'
    },
    {
      id: 'hereford2',
      nome: 'Classic Horn',
      raca: 'Hereford Aspado',
      registro: 'HER-002',
      cor: 'Vermelha',
      mocho: false,
      preco: 100,
      imagem: '/img/touros/hereford2.jpg',
      descricao: 'Hereford tradicional, excelente para cruzamentos.'
    },
    // Charolês
    {
      id: 'charoles1',
      nome: 'Charolais Power',
      raca: 'Charolês Mocho',
      registro: 'CHA-001',
      cor: 'Branca',
      mocho: true,
      preco: 130,
      imagem: '/img/touros/charoles1.jpg',
      descricao: 'Charolês Mocho, alto rendimento de carcaça.'
    },
    {
      id: 'charoles2',
      nome: 'Ivory Horn',
      raca: 'Charolês Aspado',
      registro: 'CHA-002',
      cor: 'Branca',
      mocho: false,
      preco: 125,
      imagem: '/img/touros/charoles2.jpg',
      descricao: 'Charolês tradicional, força e rusticidade.'
    },
    // Nelore
    {
      id: 'nelore1',
      nome: 'Nelore Forte',
      raca: 'Nelore Mocho',
      registro: 'NEL-001',
      cor: 'Branca',
      mocho: true,
      preco: 90,
      imagem: '/img/touros/nelore1.jpg',
      descricao: 'Nelore Mocho, rusticidade e adaptação tropical.'
    },
    {
      id: 'nelore2',
      nome: 'Nelore Raiz',
      raca: 'Nelore Padrão',
      registro: 'NEL-002',
      cor: 'Branca',
      mocho: false,
      preco: 85,
      imagem: '/img/touros/nelore2.jpg',
      descricao: 'Nelore tradicional, resistência e longevidade.'
    },
    // Senepol
    {
      id: 'senepol1',
      nome: 'Senepol Gold',
      raca: 'Senepol',
      registro: 'SEN-001',
      cor: 'Vermelha',
      mocho: true,
      preco: 140,
      imagem: '/img/touros/senepol1.jpg',
      descricao: 'Senepol, pelo curto e alta fertilidade.'
    },
    {
      id: 'senepol2',
      nome: 'Red Heat',
      raca: 'Senepol',
      registro: 'SEN-002',
      cor: 'Vermelha',
      mocho: true,
      preco: 138,
      imagem: '/img/touros/senepol2.jpg',
      descricao: 'Senepol, vigor híbrido e rusticidade.'
    }
  ];

  getDosesSemen()
    .then(data => {
      const dosesArray = Array.isArray(data) ? data : (data.doses || []);
      // Garante que os touros fixos sempre aparecem (sem duplicar se já vierem do backend)
      const todos = [
        ...tourosFixos.filter(tf => !dosesArray.some(d => d.id === tf.id)),
        ...dosesArray
      ];
      setDoses(todos);
      setFiltradas(todos);
    })
    .catch(err => setError('Erro ao carregar doses de sêmen.'))
    .finally(() => setLoading(false));
}, []);

  function handleFiltrar(e) {
    e.preventDefault();
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      setFiltradas(doses);
      return;
    }
    setFiltradas(
      doses.filter(d =>
        d.nome.toLowerCase().includes(termo) ||
        d.registro.toLowerCase().includes(termo) ||
        d.raca.toLowerCase().includes(termo)
      )
    );
  }


  const addItem = useCarrinhoSemenStore(s => s.addItem);
  const itensCarrinho = useCarrinhoSemenStore(s => s.itens);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);


  async function handleFinalizarCompra() {
    // Integração financeira: lança uma despesa para cada item do carrinho
    const hoje = new Date().toISOString().slice(0, 10);
    for (const item of itensCarrinho) {
      await lancarDespesa({
        descricao: `Compra de sêmen: ${item.nome} (${item.raca})`,
        valor: item.preco * item.quantidade,
        categoria: 'Compra de Sêmen',
        data: hoje,
        status: 'Paga',
        obs: `Registro: ${item.registro}`
      });
    }
    alert('Compra finalizada e registrada no financeiro!');
    setCarrinhoAberto(false);
  }

  return (
    <div className="central-semen-container">
      <h1>Central de Sêmen</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '16px 0 0 0', zIndex: 10, position: 'relative' }}>
        <button
          className="abrir-carrinho-btn"
          onClick={() => setCarrinhoAberto(true)}
          disabled={itensCarrinho.length === 0}
          title={itensCarrinho.length === 0 ? 'Adicione doses ao carrinho' : 'Abrir carrinho'}
        >
          🛒 Carrinho ({itensCarrinho.length})
        </button>
      </div>
      <CarrinhoSemenModal open={carrinhoAberto} onClose={() => setCarrinhoAberto(false)} onFinalizar={handleFinalizarCompra} />
      <div className="central-semen-content">
        <form className="central-semen-filtros" onSubmit={handleFiltrar}>
          <label>
            <span>Buscar touro:</span>
            <input
              type="text"
              placeholder="Nome, registro, raça..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              autoFocus
            />
          </label>
          <button type="submit">Filtrar</button>
        </form>
        <div className="central-semen-lista">
          {loading ? (
            <div className="central-semen-placeholder">
              <p>Carregando doses de sêmen...</p>
            </div>
          ) : error ? (
            <div className="central-semen-placeholder">
              <p>{error}</p>
            </div>
          ) : filtradas.length === 0 ? (
            <div className="central-semen-placeholder">
              <p>Nenhuma dose disponível.</p>
            </div>
          ) : (
            <div className="central-semen-doses">
              {filtradas.map((dose) => (
                <div className="dose-card" key={dose.id}>
                  <img src={dose.imagem} alt={dose.nome} className="dose-img" />
                  <div className="dose-info">
                    <h3>{dose.nome}</h3>
                    <span className="dose-raca">{dose.raca}</span>
                    <span className="dose-registro">Registro: {dose.registro}</span>
                    <span className="dose-cor">Cor: {dose.cor}</span>
                    <span className="dose-mocho">{dose.mocho ? 'Mocho' : 'Com chifres'}</span>
                    <p className="dose-desc">{dose.descricao}</p>
                    <span className="dose-preco">R$ {dose.preco},00 / dose</span>
                    <button className="dose-btn" onClick={() => addItem(dose)} type="button">Adicionar ao carrinho</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CentraisSemen;