import { useEffect, useState } from "react";
import api from "../api/api";

export default function Categorias() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    api.get("/categories").then(res => setLista(res.data));
  }, []);

  return (
    <div className="container">
      <h1>Categorias</h1>

      <ul>
        {lista.map(cat => (
          <li key={cat.id}>
            {cat.nome} — {cat.tipo}
          </li>
        ))}
      </ul>
    </div>
  );
}
