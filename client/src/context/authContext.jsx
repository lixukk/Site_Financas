import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Registrando usuário
  async function registerUser(nome, email, senha) {
    try {
      await axios.post("http://localhost:4000/register", {
        name: nome,
        email,
        password: senha,
      });

      return true;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao registrar! Verifique os dados.");
      return false;
    }
  }

  // Login
  async function login(email, senha) {
    try {
      const response = await axios.post("http://localhost:4000/login", {
        email,
        password: senha,
      });

        setUser(response.data.user);
        return true;

    } catch (error) {
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
