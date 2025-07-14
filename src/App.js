import React, { useState } from 'react';

function App() {
  const [treino, setTreino] = useState('');
  const [lista, setLista] = useState([]);

  const adicionarTreino = (e) => {
    e.preventDefault();
    if (treino.trim() === '') return;
    setLista([...lista, treino]);
    setTreino('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Treino Tracker</h1>
      <form onSubmit={adicionarTreino}>
        <input
          type="text"
          value={treino}
          onChange={(e) => setTreino(e.target.value)}
          placeholder="Digite o treino"
          style={{ padding: 8, marginRight: 10 }}
        />
        <button type="submit" style={{ padding: 8 }}>Adicionar</button>
      </form>
      <ul>
        {lista.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
