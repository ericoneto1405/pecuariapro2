
import React, { useState, useEffect } from "react";
import "./CarrinhoSemenModal.css";
import useArrobaModalStore from "../state/useArrobaModalStore";
import { setArrobaManual, getArrobaManual } from "../api/arrobaManualService";


export default function ArrobaUpdateModal() {
  const { showModal, setShowModal } = useArrobaModalStore();

  const [valor, setValor] = useState("");
  const [valorAtual, setValorAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Busca o valor atual ao abrir o modal
  useEffect(() => {
    if (showModal) {
      setValor("");
      setMsg("");
      setValorAtual(null);
      getArrobaManual().then((data) => {
        if (data && typeof data.arroba === 'number') {
          setValorAtual(data.arroba);
        }
      });
    }
  }, [showModal]);

  if (!showModal) return null;

  async function handleAtualizar() {
    setLoading(true);
    setMsg("");
    try {
      const v = parseFloat(valor.replace(",", "."));
      if (isNaN(v) || v <= 0) {
        setMsg("Digite um valor válido para a arroba.");
        setLoading(false);
        return;
      }
      await setArrobaManual(v);
      setMsg("Valor atualizado com sucesso!");
      setTimeout(() => {
        setShowModal(false);
        setValor("");
        setMsg("");
      }, 1200);
    } catch (e) {
      setMsg("Erro ao atualizar valor.");
    }
    setLoading(false);
  }

  return (
    <div className="carrinho-semen-modal-bg" onClick={() => setShowModal(false)}>
      <aside className="carrinho-semen-modal" onClick={e => e.stopPropagation()}>
        <header>
          <h2>Atualização da Arroba</h2>
          <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
        </header>
        <div style={{ padding: '24px' }}>
          <p style={{ fontSize: '1.1rem', color: '#2d3a4a', marginBottom: 16 }}>
            A cada 15 dias do jogo, é necessário atualizar manualmente o valor da arroba do boi.<br />
            Digite o novo valor e clique em atualizar.
          </p>
          <div style={{ marginBottom: 16, color: '#444', fontWeight: 500 }}>
            Valor atual: {valorAtual !== null ? `R$ ${valorAtual.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : '---'}
          </div>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Valor da arroba (R$)"
            value={valor}
            onChange={e => setValor(e.target.value)}
            style={{ width: '100%', fontSize: '1.1rem', marginBottom: 16, padding: 8 }}
            disabled={loading}
          />
          <button
            className="carrinho-finalizar"
            onClick={handleAtualizar}
            disabled={loading}
          >
            {loading ? "Atualizando..." : "Atualizar Arroba"}
          </button>
          {msg && <div style={{ marginTop: 12, color: msg.includes('sucesso') ? 'green' : 'red' }}>{msg}</div>}
        </div>
      </aside>
    </div>
  );
}
