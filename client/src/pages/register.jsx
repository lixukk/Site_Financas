import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Register() {
  const { registerUser } = useContext(AuthContext);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await registerUser(nome, email, senha);

    if (ok) {
      alert("Conta criada com sucesso!");
      window.location.href = "/"; // redireciona para login
    }
  }

  return (
    <div className="container">
      <h2>Criar Conta</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
        <button type="submit">Registrar</button>
      </form>

      <p>
        Já possui conta? <Link to="/">Entrar</Link>
      </p>
    </div>
  );
}

