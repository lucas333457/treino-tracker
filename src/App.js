import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const defaultExercises = [
  { id: 1, name: "Supino" },
  { id: 2, name: "Agachamento" },
  { id: 3, name: "Remada" },
];

function App() {
  const [exercises, setExercises] = useState(defaultExercises);
  const [workoutData, setWorkoutData] = useState(() => {
    // Puxa do localStorage ou cria vazio
    const saved = localStorage.getItem("workoutData");
    return saved ? JSON.parse(saved) : {};
  });
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [newExerciseName, setNewExerciseName] = useState("");

  // Salvar localStorage quando workoutData mudar
  useEffect(() => {
    localStorage.setItem("workoutData", JSON.stringify(workoutData));
  }, [workoutData]);

  // Função que retorna a semana atual no formato YYYY-WW
  function getCurrentWeek() {
    const now = new Date();
    const year = now.getFullYear();
    const onejan = new Date(year, 0, 1);
    const week = Math.ceil(((now - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    return `${year}-W${week}`;
  }

  // Pega ou inicializa os dados da semana atual
  function getWeekData(week) {
    if (!workoutData[week]) {
      return {};
    }
    return workoutData[week]()
