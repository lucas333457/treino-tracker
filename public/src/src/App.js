import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function getCurrentWeekKey() {
  const now = new Date();
  const firstDay = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
  return firstDay.toISOString().split("T")[0];
}

export default function TreinoTracker() {
  const [exercicios, setExercicios] = useState([]);
  const [nome, setNome] = useState("");
  const [obs, setObs] = useState("");
  const [semanaAtual, setSemanaAtual] = useState(getCurrentWeekKey());

  useEffect(() => {
    const dadosSalvos = JSON.parse(localStorage.getItem("treinosPorSemana") || "{}");
    const semana = getCurrentWeekKey();
    setSemanaAtual(semana);
    setExercicios(dadosSalvos[semana] || []);
  }, []);

  useEffect(() => {
    const dadosSalvos = JSON.parse(localStorage.getItem("treinosPorSemana") || "{}");
    dadosSalvos[semanaAtual] = exercicios;
    localStorage.setItem("treinosPorSemana", JSON.stringify(dadosSalvos));
  }, [exercicios, semanaAtual]);

  const adicionarExercicio = () => {
    if (!nome.trim()) return;
    const novo = {
      id: Date.now(),
      nome,
      vezes: 0,
      obs
    };
    setExercicios([novo, ...exercicios]);
    setNome("");
    setObs("");
  };

  const incrementar = (id) => {
    setExercicios(
      exercicios.map((e) =>
        e.id === id ? { ...e, vezes: e.vezes + 1 } : e
      )
    );
  };

  const resetar = (id) => {
    setExercicios(
      exercicios.map((e) =>
        e.id === id ? { ...e, vezes: 0 } : e
      )
    );
  };

  return (
    <div style={{backgroundColor: "#121212", color: "white", minHeight: "100vh", padding: "20px", maxWidth: "600px", margin: "auto"}}>
      <h1 style={{textAlign: "center"}}>Relatório de Treino - Semana {semanaAtual}</h1>
      <div style={{marginBottom: "15px"}}>
        <input
          type="text"
          placeholder="Nome do exercício"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{width: "100%", padding: "10px", marginBottom: "10px", backgroundColor: "#333", border: "none", borderRadius: "5px", color: "white"}}
        />
        <textarea
          placeholder="Observações"
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          style={{width: "100%", padding: "10px", height: "60px", marginBottom: "10px", backgroundColor: "#333", border: "none", borderRadius: "5px", color: "white"}}
        />
        <button onClick={adicionarExercicio} style={{width: "100%", padding: "10px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}>
          Adicionar
        </button>
      </div>

      {exercicios.length === 0 && (
        <p style={{textAlign: "center", color: "#999"}}>Nenhum exercício adicionado.</p>
      )}

      <div style={{marginBottom: "20px"}}>
        {exercicios.map((e) => (
          <div key={e.id} style={{backgroundColor: "#1e1e1e", padding: "15px", borderRadius: "8px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div>
              <h2>{e.nome}</h2>
              <p>Feito: {e.vezes}x</p>
              {e.obs && <p style={{fontStyle: "italic"}}>Obs: {e.obs}</p>}
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
              <button onClick={() => incrementar(e.id)} style={{padding: "6px 10px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}>+1</button>
              <button onClick={() => resetar(e.id)} style={{padding: "6px 10px", backgroundColor: "#6b7280", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}>Reset</button>
            </div>
          </div>
        ))}
      </div>

      {exercicios.length > 0 && (
        <div style={{height: 300}}>
          <h2 style={{textAlign: "center"}}>Gráfico de Frequência</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={exercicios} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="nome" stroke="#ccc" />
              <YAxis allowDecimals={false} stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }} />
              <Bar dataKey="vezes" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
