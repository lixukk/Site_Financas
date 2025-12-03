import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Sidebar() {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <div className="sidebar">
      <h2>💰 FinanceApp</h2>

      <Link to="/dashboard">Dashboard</Link>
      <Link to="/transacoes">Transações</Link>
      <Link to="/categorias">Categorias</Link>
      <Link to="/orcamentos">Orçamentos</Link>

      <hr />

      <button onClick={toggleTheme}>Alterar Tema</button>
    </div>
  );
}
