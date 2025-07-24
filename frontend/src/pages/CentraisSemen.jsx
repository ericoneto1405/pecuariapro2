


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
    getDosesSemen()
      .then(data => {
        setDoses(data);
        setFiltradas(data);
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
      <button
        className="abrir-carrinho-btn"
        style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}
        onClick={() => setCarrinhoAberto(true)}
        disabled={itensCarrinho.length === 0}
        title={itensCarrinho.length === 0 ? 'Adicione doses ao carrinho' : 'Abrir carrinho'}
      >
        🛒 Carrinho ({itensCarrinho.length})
      </button>
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