// client/src/components/transactionModal.jsx
import { useState, useEffect } from "react";
import api from "../api/api";

export default function TransactionModal({ isOpen, onClose, type, onSuccess }) {
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.get(`/categories?tipo=${type}`).then((res) => {
        setCategorias(res.data);
        if (res.data.length > 0) setCategoriaId(res.data[0].id);
      });
    }
  }, [isOpen, type]);

  async function handleSubmit(e) {
    e.preventDefault();

    // --- VALIDAÇÃO DE VALOR POSITIVO ---
    const valorNumerico = parseFloat(valor);
    if (valorNumerico <= 0) {
      alert("O valor deve ser maior que zero.");
      return;
    }

    try {
      await api.post("/transactions", {
        valor: valorNumerico, // Envia sempre positivo
        descricao,
        categoria_id: categoriaId,
        tipo: type,
        data,
      });
      onSuccess(); 
      onClose();   
      setValor("");
      setDescricao("");
    } catch (err) {
      alert("Erro ao salvar transação");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{type === "entrada" ? "Nova Receita" : "Nova Despesa"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0.01" // Impede setas do teclado de descerem para negativo
            value={valor}
            onChange={(e) => {
              // Impede digitação manual de números negativos
              const val = e.target.value;
              if (val >= 0) setValor(val);
            }}
            required
            autoFocus
            placeholder="0.00"
          />

          <label>Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Salário, Mercado..."
            required
          />

          <label>Categoria</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>

          <label>Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />

          <button type="submit" style={{ marginTop: "1rem" }}>
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
}