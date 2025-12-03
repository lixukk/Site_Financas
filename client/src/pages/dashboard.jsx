// client/src/pages/dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import TransactionModal from "../components/transactionModal";

export default function Dashboard() {
  const [saldo, setSaldo] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("entrada"); // 'entrada' ou 'saida'

  // Função para buscar o saldo
  function fetchSaldo() {
    api.get("/dashboard/balance").then((res) => setSaldo(res.data.saldo));
  }

  useEffect(() => {
    fetchSaldo();
  }, []);

  function handleOpenModal(type) {
    setModalType(type);
    setModalOpen(true);
  }

  return (
    <div className="container">
      <div className="header-flex">
        <h1>Dashboard</h1>
      </div>

      <div className="card balance-card">
        <h2>Saldo Atual</h2>
        <div className={`saldo-value ${saldo >= 0 ? "positive" : "negative"}`}>
          R$ {Number(saldo).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className="actions-grid mt-4">
        <button 
          className="btn-income" 
          onClick={() => handleOpenModal("entrada")}
        >
          + Adicionar Saldo (Receita)
        </button>
        
        <button 
          className="btn-expense" 
          onClick={() => handleOpenModal("saida")}
        >
          - Remover Saldo (Despesa)
        </button>
      </div>

      {/* Modal de Transação */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        onSuccess={fetchSaldo} // Recarrega o saldo ao salvar!
      />
    </div>
  );
}