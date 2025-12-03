import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/login";
import Register from "./pages/register";

import Dashboard from "./pages/dashboard";
import Transacoes from "./pages/transactions";
import Categorias from "./pages/categories";
import Orcamentos from "./pages/orcamentos";

import Layout from "./layout/Layout";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Telas sem layout */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Telas com sidebar */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/transacoes" element={<Layout><Transacoes /></Layout>} />
            <Route path="/categorias" element={<Layout><Categorias /></Layout>} />
            <Route path="/orcamentos" element={<Layout><Orcamentos /></Layout>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
