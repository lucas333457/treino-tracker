import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

const defaultExercises = [
  { id: 1, name: "Supino" },
  { id: 2, name: "Agachamento" },
  { id: 3, name: "Remada" },
];

function App() {
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem("exercises");
    return saved ? JSON.parse(saved) : defaultExercises;
  });

  const [workoutData, setWorkoutData] = useState(() => {
    const saved = localStorage.getItem("workoutData");
    return saved ? JSON.parse(saved) : {};
  });

  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [newExerciseName, setNewExerciseName] = useState("");

  useEffect(() => {
    localStorage.setItem("workoutData", JSON.stringify(workoutData));
  }, [workoutData]);

  useEffect(() => {
    localStorage.setItem("exercises", JSON.stringify(exercises));
  }, [exercises]);

  function getCurrentWeek() {
    const now = new Date();
    const year = now.getFullYear();
    const onejan = new Date(year, 0, 1);
    const week = Math.ceil(((now - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    return `${year}-W${week}`;
  }

  function getWeekData(week) {
    return workoutData[week] || {};
  }

  function changeSeries(exerciseId, delta) {
    setWorkoutData((prev) => {
      const weekData = { ...getWeekData(currentWeek) };
      const currentSeries = weekData[exerciseId]?.series || 0;
      const newSeries = Math.max(0, currentSeries + delta);
      const currentWeight = weekData[exerciseId]?.weight || "";

      weekData[exerciseId] = { series: newSeries, weight: currentWeight };
      return { ...prev, [currentWeek]: weekData };
    });
  }

  function changeWeight(exerciseId, value) {
    if (value !== "" && isNaN(value)) return; // só aceita números ou vazio
    setWorkoutData((prev) => {
      const weekData = { ...getWeekData(currentWeek) };
      const currentSeries = weekData[exerciseId]?.series || 0;
      weekData[exerciseId] = { series: currentSeries, weight: value };
      return { ...prev, [currentWeek]: weekData };
    });
  }

  function addExercise() {
    if (!newExerciseName.trim()) return;
    setExercises((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, name: newExerciseName.trim() },
    ]);
    setNewExerciseName("");
  }

  function changeWeek(delta) {
    let [yearStr, weekStr] = currentWeek.split("-W");
    let year = parseInt(yearStr);
    let week = parseInt(weekStr);

    week += delta;
    if (week < 1) {
      year--;
      week = 52;
    } else if (week > 52) {
      year++;
      week = 1;
    }
    setCurrentWeek(`${year}-W${week}`);
  }

  const chartData = exercises
    .map(({ id, name }) => {
      const weekData = getWeekData(currentWeek);
      return {
        name,
        series: weekData[id]?.series || 0,
      };
    })
    .filter((d) => d.series > 0);

  return (
    <div style={{ maxWidth: 700, margin: "auto", fontFamily: "Arial, sans-serif", padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Treino Tracker</h2>
      </header>

      <div style={{ marginBottom: 15 }}>
        <button onClick={() => changeWeek(-1)}>{"< Semana anterior"}</button>
        <span style={{ margin: "0 15px" }}>{currentWeek}</span>
        <button onClick={() => changeWeek(1)}>{"Semana seguinte >"}</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Novo exercício"
          value={newExerciseName}
          onChange={(e) => setNewExerciseName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addExercise(); }}
          style={{ padding: 6, width: 200 }}
        />
        <button onClick={addExercise} style={{ marginLeft: 10, padding: "6px 12px" }}>
          Adicionar
        </button>
      </div>

      {exercises.map(({ id, name }) => {
        const weekData = getWeekData(currentWeek);
        const series = weekData[id]?.series || 0;
        const weight = weekData[id]?.weight || "";

        return (
          <div
            key={id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
              gap: 10,
            }}
          >
            <div style={{ flex: 1 }}>{name}</div>

            <button onClick={() => changeSeries(id, -1)} disabled={series === 0}>
              -
            </button>
            <span>{series}</span>
            <button onClick={() => changeSeries(id, 1)}>+</button>

            <input
              type="text"
              placeholder="Peso (kg)"
              value={weight}
              onChange={(e) => changeWeight(id, e.target.value)}
              style={{ width: 80, marginLeft: 10 }}
            />
          </div>
        );
      })}

      <h3>Gráfico de séries da semana</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="series" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>Nenhum dado para mostrar no gráfico.</p>
      )}
    </div>
  );
}

export default App;
