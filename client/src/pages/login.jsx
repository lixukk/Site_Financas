import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom"; // 1. Importar useNavigate

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // 2. Inicializar o hook
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    
    // 3. Verificar se o login foi bem-sucedido
    const sucesso = await login(email, senha);
    
    if (sucesso) {
      navigate("/dashboard"); // 4. Redirecionar para o Dashboard
    }
  }

  return (
    <div className="container">
      <h2>Entrar</h2>

      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Email" 
          value={email} // Boa prática: controlar o valor
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={senha}
          onChange={e => setSenha(e.target.value)} 
        />
        <button type="submit">Entrar</button>
      </form>

      <p>
        Não tem conta? <Link to="/register">Criar conta</Link>
      </p>
    </div>
  );
}