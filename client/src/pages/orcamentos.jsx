import { useState, useEffect } from "react";
import api from "../api/api";

export default function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [catId, setCatId] = useState("");
  const [valor, setValor] = useState("");

  useEffect(() => {
    loadData();
    api.get("/categories?tipo=saida").then((res) => {
        setCategorias(res.data);
        if (res.data.length > 0) setCatId(res.data[0].id);
    });
  }, []);

  function loadData() {
    api.get("/budgets").then((res) => setOrcamentos(res.data));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!valor || !catId) return;

    try {
      await api.post("/budgets", { categoria_id: catId, valor: parseFloat(valor) });
      setValor("");
      loadData();
      alert("Meta definida com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar orçamento");
    }
  }

  async function handleDelete(idCategoria) {
    if(confirm("Deseja remover esta meta de orçamento?")) {
        try {
            await api.delete(`/budgets/${idCategoria}`);
            loadData();
        } catch (err) {
            alert("Erro ao remover meta.");
        }
    }
  }

  return (
    <div className="container">
      <h1>Metas de Gastos (Mensal)</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Definir Nova Meta</h3>
        <form onSubmit={handleSubmit} className="budget-form">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Categoria</label>
            <select value={catId} onChange={e => setCatId(e.target.value)} required>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Limite Mensal (R$)</label>
            <input 
                type="number" 
                value={valor} 
                onChange={e => setValor(e.target.value)} 
                placeholder="Ex: 500.00"
                required 
            />
          </div>
          <button type="submit">Salvar Meta</button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {orcamentos.map(orc => {
          const porcentagem = Math.min((orc.gasto_atual / orc.limite) * 100, 100);
          const isEstourado = orc.gasto_atual > orc.limite;
          const corBarra = isEstourado ? '#ef4444' : '#10b981';
          const corTexto = isEstourado ? '#ef4444' : '#6b7280';

          return (
            <div key={orc.categoria_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                    <strong style={{ fontSize: '1.1rem' }}>{orc.categoria_nome}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '4px' }}>
                        Gasto: <b>R$ {Number(orc.gasto_atual).toFixed(2)}</b> / Meta: <b>R$ {Number(orc.limite).toFixed(2)}</b>
                    </div>
                </div>
                <button 
                    onClick={() => handleDelete(orc.categoria_id)}
                    style={{ background: '#fee2e2', color: '#ef4444', padding: '0.5rem', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Remover meta"
                >
                    ✕
                </button>
              </div>

              <div style={{ width: '100%', background: '#e5e7eb', height: '12px', borderRadius: '6px', overflow: 'hidden', marginTop: '10px' }}>
                <div style={{ width: `${porcentagem}%`, background: corBarra, height: '100%', transition: 'width 0.5s ease' }} />
              </div>
              
              <div style={{ textAlign: 'right', fontSize: '0.85rem', marginTop: '5px', color: corTexto, fontWeight: '500' }}>
                {isEstourado ? `Você excedeu o limite em R$ ${(orc.gasto_atual - orc.limite).toFixed(2)}!` : `${porcentagem.toFixed(0)}% da meta consumida`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}