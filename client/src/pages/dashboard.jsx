import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    api.get("/transactions/saldo").then(res => setSaldo(res.data.saldo));
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <h2>Saldo atual: R$ {saldo}</h2>
    </div>
  );
}
