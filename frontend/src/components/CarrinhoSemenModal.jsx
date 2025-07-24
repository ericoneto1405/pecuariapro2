import React from 'react';
import './CarrinhoSemenModal.css';
import useCarrinhoSemenStore from '../state/useCarrinhoSemenStore';

export default function CarrinhoSemenModal({ open, onClose, onFinalizar }) {
  const itens = useCarrinhoSemenStore(s => s.itens);
  const removeItem = useCarrinhoSemenStore(s => s.removeItem);
  const clear = useCarrinhoSemenStore(s => s.clear);
  const total = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  if (!open) return null;

  return (
    <div className="carrinho-semen-modal-bg" onClick={onClose}>
      <aside className="carrinho-semen-modal" onClick={e => e.stopPropagation()}>
        <header>
          <h2>Carrinho de Sêmen</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>
        <div className="carrinho-semen-lista">
          {itens.length === 0 ? (
            <p className="carrinho-vazio">Seu carrinho está vazio.</p>
          ) : (
            itens.map(item => (
              <div className="carrinho-item" key={item.id}>
                <img src={item.imagem} alt={item.nome} />
                <div className="carrinho-info">
                  <span className="carrinho-nome">{item.nome}</span>
                  <span className="carrinho-raca">{item.raca}</span>
                  <span className="carrinho-quantidade">Qtd: {item.quantidade}</span>
                  <span className="carrinho-preco">R$ {item.preco},00</span>
                </div>
                <button className="carrinho-remove" onClick={() => removeItem(item.id)} title="Remover">&times;</button>
              </div>
            ))
          )}
        </div>
        <footer>
          <div className="carrinho-total">Total: <b>R$ {total},00</b></div>
          <button className="carrinho-finalizar" onClick={() => { onFinalizar(); clear(); }}>Finalizar compra</button>
        </footer>
      </aside>
    </div>
  );
}
