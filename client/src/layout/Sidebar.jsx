import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/authContext";

export default function Sidebar() {
  const { toggleTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="sidebar">
      <h2>💰 FinanceApp</h2>

      <Link to="/dashboard">Dashboard</Link>
      <Link to="/transacoes">Transações</Link>
      <Link to="/categorias">Categorias</Link>
      <Link to="/orcamentos">Orçamentos</Link>

      <hr />

      <button 
        onClick={handleLogout}
        style={{ 
          marginBottom: "0.5rem", 
          backgroundColor: "#ef4444", 
          color: "white"
        }} 
      >
        Sair
      </button>

      <button onClick={toggleTheme}>Alterar Tema</button>
    </div>
  );
}