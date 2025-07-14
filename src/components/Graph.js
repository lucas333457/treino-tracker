// src/components/Graph.js
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function Graph({ data }) {
  const formatted = data.map((ex) => ({
    name: ex.name,
    treinos: ex.count
  }));

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Mais treinados</h2>
      <BarChart width={300} height={200} data={formatted}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="treinos" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default Graph;
