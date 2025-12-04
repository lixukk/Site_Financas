import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function registerUser(nome, email, senha) {
    try {
      await axios.post("http://localhost:4000/api/auth/register", {
        nome,
        email,
        senha,
      });
      return true;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert(error.response?.data?.error || "Erro ao registrar!");
      return false;
    }
  }

  async function login(email, senha) {
    try {
      const response = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        senha,
      });

      // --- CORREÇÃO IMPORTANTE AQUI ---
      // Salva o token no navegador para usar nas requisições
      localStorage.setItem("token", response.data.token);
      
      setUser(response.data.user);
      return true;

    } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Email ou senha incorretos!");
      return false;
    }
  }

  // Opcional: Função para sair (logout)
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, registerUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}