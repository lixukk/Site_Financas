import { useState, useEffect } from "react";
import api from "../api/api";

export default function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Estados do formulário
  const [catId, setCatId] = useState("");
  const [valor, setValor] = useState("");

  // Carregar dados ao abrir a página
  useEffect(() => {
    loadData();
    // Carregar categorias apenas de SAÍDA para o select (pois orçamentos são para gastos)
    api.get("/categories?tipo=saida").then((res) => {
        setCategorias(res.data);
        if (res.data.length > 0) setCatId(res.data[0].id); // Seleciona a primeira por padrão
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
      loadData(); // Recarrega a lista para mostrar a nova meta
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

      {/* Formulário de Definição de Meta */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Definir Nova Meta</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
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
          <button type="submit" style={{ marginBottom: '1rem' }}>Salvar Meta</button>
        </form>
      </div>

      {/* Lista de Orçamentos com Barra de Progresso */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {orcamentos.map(orc => {
          // Cálculo da porcentagem
          const porcentagem = Math.min((orc.gasto_atual / orc.limite) * 100, 100);
          const isEstourado = orc.gasto_atual > orc.limite;
          
          // Cores dinâmicas
          const corBarra = isEstourado ? '#ef4444' : '#10b981'; // Vermelho ou Verde
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

              {/* Barra de Progresso Visual */}
              <div style={{ width: '100%', background: '#e5e7eb', height: '12px', borderRadius: '6px', overflow: 'hidden', marginTop: '10px' }}>
                <div style={{ 
                  width: `${porcentagem}%`, 
                  background: corBarra, 
                  height: '100%', 
                  transition: 'width 0.5s ease' 
                }} />
              </div>
              
              <div style={{ textAlign: 'right', fontSize: '0.85rem', marginTop: '5px', color: corTexto, fontWeight: '500' }}>
                {isEstourado ? `Você excedeu o limite em R$ ${(orc.gasto_atual - orc.limite).toFixed(2)}!` : `${porcentagem.toFixed(0)}% da meta consumida`}
              </div>
            </div>
          );
        })}
        
        {orcamentos.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
                Nenhuma meta definida. Adicione uma acima para controlar seus gastos!
            </p>
        )}
      </div>
    </div>
  );
}