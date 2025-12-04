// client/src/pages/transactions.jsx
import { useState, useEffect } from "react";
import api from "../api/api";

export default function Transacoes() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  function loadTransactions() {
    api.get("/transactions").then(res => setLista(res.data));
  }

  // Deletar UMA transação
  async function handleDelete(id) {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await api.delete(`/transactions/${id}`);
        loadTransactions();
      } catch (err) {
        alert("Erro ao excluir.");
      }
    }
  }

  // Deletar TODAS as transações (Reset)
  async function handleReset() {
    const confirmacao = confirm("⚠️ ATENÇÃO: Isso apagará TODO o seu histórico de transações e o saldo voltará a zero.\n\nTem certeza absoluta?");
    
    if (confirmacao) {
      try {
        await api.delete("/transactions");
        alert("Todas as transações foram apagadas.");
        loadTransactions(); // Atualiza a lista para vazio
      } catch (err) {
        console.error(err);
        alert("Erro ao resetar transações.");
      }
    }
  }

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1>Histórico de Transações</h1>
        
        {/* Só mostra o botão se houver transações para apagar */}
        {lista.length > 0 && (
          <button 
            onClick={handleReset}
            style={{ backgroundColor: "#ef4444", width: "auto" }}
            title="Apagar tudo e zerar saldo"
          >
            🗑️ Resetar Tudo
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {lista.map(item => (
            <tr key={item.id}>
              <td>{item.descricao || "—"}</td>
              <td>{item.categoria_nome}</td>
              <td>{new Date(item.data).toLocaleDateString()}</td>
              <td style={{ 
                color: item.tipo === 'entrada' ? '#10b981' : '#ef4444',
                fontWeight: 'bold'
              }}>
                {item.tipo === 'entrada' ? '+' : '-'} R$ {Number(item.valor).toFixed(2)}
              </td>
              <td>
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{ background: 'transparent', color: '#ef4444', padding: '0.5rem', width: 'auto' }}
                  title="Excluir"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {lista.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", marginTop: "2rem" }}>
          Nenhuma transação encontrada.
        </p>
      )}
    </div>
  );
}