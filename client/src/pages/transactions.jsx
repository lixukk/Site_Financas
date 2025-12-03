import { useState, useEffect } from "react";
import api from "../api/api";

export default function Transacoes() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    api.get("/transactions").then(res => setLista(res.data));
  }, []);

  return (
    <div className="container">
      <h1>Transações</h1>

      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {lista.map(item => (
            <tr key={item.id}>
              <td>{item.descricao}</td>
              <td>R$ {item.valor}</td>
              <td>{item.tipo}</td>
              <td>{item.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
