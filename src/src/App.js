import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

function getCurrentWeekKey() {
  const now = new Date();
  const firstDay = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  return firstDay.toISOString().split("T")[0];
}

export default function TreinoTracker() {
  const [exercicios, setExercicios] = useState([]);
  const [nome, setNome] = useState("");
  const [obs, setObs] = useState("");
  const [semanaAtual, setSemanaAtual] = useState(getCurrentWeekKey());

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("treinosPorSemana") || "{}");
    setExercicios(dados[semanaAtual] || []);
  }, [semanaAtual]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("treinosPorSemana") || "{}");
    dados[semanaAtual] = exercicios;
    localStorage.setItem("treinosPorSemana", JSON.stringify(dados));
  }, [exercicios, semanaAtual]);

  const adicionarExercicio = () => {
    if (!nome.trim()) return;
    setExercicios([
      { id: Date.now(), nome, vezes: 0, obs },
      ...exercicios,
    ]);
    setNome("");
    setObs("");
  };

  const incrementar = (id) => {
    setExercicios(exercicios.map(e => e.id === id ? { ...e, vezes: e.vezes + 1 } : e));
  };

  const resetar = (id) => {
    setExercicios(exercicios.map(e => e.id === id ? { ...e, vezes: 0 } : e));
  };

  return (
    <div style={{ backgroundColor: "#121212", color: "#fff", padding: 20, minHeight: "100vh", maxWidth: 600, margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Treino - Semana {semanaAtual}</h1>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Ex: Supino"
        style={{ width: "100%", padding: 10, marginBottom: 10, background: "#333", border: "none", color: "#fff", borderRadius: 5 }}
      />
      <textarea
        value={obs}
        onChange={(e) => setObs(e.target.value)}
        placeholder="Observações (opcional)"
        style={{ width: "100%", padding: 10, marginBottom: 10, background: "#333", border: "none", color: "#fff", borderRadius: 5 }}
      />
      <button onClick={adicionarExercicio} style={{ width: "100%", padding: 10, background: "#4f46e5", color: "#fff", border: "none", borderRadius: 5 }}>
        Adicionar
      </button>

      <div style={{ marginTop: 20 }}>
        {exercicios.map(e => (
          <div key={e.id} style={{ background: "#1e1e1e", padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <strong>{e.nome}</strong> — {e.vezes}x
            {e.obs && <p style={{ fontStyle: "italic", color: "#aaa" }}>{e.obs}</p>}
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button onClick={() => incrementar(e.id)} style={{ flex: 1, background: "#2563eb", color: "#fff", border: "none", padding: 8, borderRadius: 5 }}>+1</button>
              <button onClick={() => resetar(e.id)} style={{ flex: 1, background: "#6b7280", color: "#fff", border: "none", padding: 8, borderRadius: 5 }}>Reset</button>
            </div>
          </div>
        ))}
      </div>

      {exercicios.length > 0 && (
        <div style={{ height: 300, marginTop: 40 }}>
          <h2 style={{ textAlign: "center" }}>Frequência</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={exercicios}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="nome" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }} />
              <Bar dataKey="vezes" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
