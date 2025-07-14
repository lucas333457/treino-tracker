import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const defaultExercises = [
  { id: 1, name: "Supino" },
  { id: 2, name: "Agachamento" },
  { id: 3, name: "Remada" },
];

export default function App() {
  const [exercises, setExercises] = useState(defaultExercises);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("workoutData");
    return saved ? JSON.parse(saved) : {};
  });
  const [newExerciseName, setNewExerciseName] = useState("");

  // Salvar no localStorage sempre que data mudar
  useEffect(() => {
    localStorage.setItem("workoutData", JSON.stringify(data));
  }, [data]);

  // Adicionar novo exercício
  function addExercise() {
    if (!newExerciseName.trim()) return;
    const newId =
      exercises.length > 0
        ? Math.max(...exercises.map((e) => e.id)) + 1
        : 1;
    setExercises([...exercises, { id: newId, name: newExerciseName.trim() }]);
    setNewExerciseName("");
  }

  // Atualiza reps e peso para um exercício
  function updateExercise(id, field, value) {
    setData((oldData) => {
      const newData = { ...oldData };
      if (!newData[id]) newData[id] = { reps: 0, weight: 0 };
      newData[id][field] = Math.max(0, value);
      return newData;
    });
  }

  // Soma total de reps para gráfico
  const chartData = exercises.map((ex) => ({
    name: ex.name,
    reps: data[ex.id]?.reps || 0,
  }));

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial" }}>
      <h1>Treino Tracker</h1>

      <div>
        <input
          placeholder="Novo exercício"
          value={newExerciseName}
          onChange={(e) => setNewExerciseName(e.target.value)}
        />
        <button onClick={addExercise}>Adicionar</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {exercises.map((ex) => (
          <div
            key={ex.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <strong style={{ flex: 1 }}>{ex.name}</strong>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label>
                Peso:
                <button
                  onClick={() =>
                    updateExercise(ex.id, "weight", (data[ex.id]?.weight || 0) - 1)
                  }
                >
                  -
                </button>
                <span style={{ margin: "0 5px" }}>{data[ex.id]?.weight || 0}</span>
                <button
                  onClick={() =>
                    updateExercise(ex.id, "weight", (data[ex.id]?.weight || 0) + 1)
                  }
                >
                  +
                </button>
              </label>

              <label>
                Reps:
                <button
                  onClick={() =>
                    updateExercise(ex.id, "reps", (data[ex.id]?.reps || 0) - 1)
                  }
                >
                  -
                </button>
                <span style={{ margin: "0 5px" }}>{data[ex.id]?.reps || 0}</span>
                <button
                  onClick={() =>
                    updateExercise(ex.id, "reps", (data[ex.id]?.reps || 0) + 1)
                  }
                >
                  +
                </button>
              </label>
            </div>
          </div>
        ))}
      </div>

      <h2>Gráfico de Repetições</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="reps" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
