import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Registrando usuário
  async function registerUser(nome, email, senha) {
    try {
      // CORREÇÃO: URL completa com /api/auth e porta 4000
      await axios.post("http://localhost:4000/api/auth/register", {
        nome,   // Enviando 'nome' conforme o backend espera (não 'name')
        email,
        senha,  // Enviando 'senha' conforme o backend espera (não 'password')
      });

      return true;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao registrar! Verifique se o servidor está rodando.");
      return false;
    }
  }

  // Login
  async function login(email, senha) {
    try {
      // CORREÇÃO: URL completa com /api/auth e porta 4000
      const response = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        senha,
      });

      // Salva o token se necessário (opcional: localStorage.setItem('token', response.data.token))
      setUser(response.data.user);
      return true;

    } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Email ou senha incorretos!");
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{ user, registerUser, login }}>
      {children}
    </AuthContext.Provider>
  );
}