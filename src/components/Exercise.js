// src/components/Exercise.js
import React from "react";

function Exercise({ data, onChange }) {
  const { id, name, count, weight, reps } = data;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3>
        {name}{" "}
        <button onClick={() => onChange(id, "count", count + 1)}>+</button>
        <button onClick={() => onChange(id, "count", count - 1)}>-</button>
      </h3>
      <input
        type="number"
        placeholder="Peso (kg)"
        value={weight}
        onChange={(e) => onChange(id, "weight", Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => onChange(id, "reps", Number(e.target.value))}
      />
    </div>
  );
}

export default Exercise;
