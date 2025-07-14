// src/App.js
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import Exercise from "./components/Exercise";
import Graph from "./components/Graph";
import Login from "./components/Login";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verifica login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          await setDoc(docRef, { exercises: [] });
        }
        const unsubData = onSnapshot(docRef, (docSnap) => {
          setExercises(docSnap.data().exercises || []);
          setLoading(false);
        });
        return unsubData;
      } else {
        setExercises([]);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const updateExercise = async (updatedList) => {
    if (user) {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { exercises: updatedList });
    }
  };

  const handleAddExercise = (name) => {
    const newExercise = {
      id: uuidv4(),
      name,
      count: 0,
      weight: 0,
      reps: 0
    };
    const updated = [...exercises, newExercise];
    setExercises(updated);
    updateExercise(updated);
  };

  const handleUpdate = (id, field, value) => {
    const updated = exercises.map((ex) =>
      ex.id === id ? { ...ex, [field]: value } : ex
    );
    setExercises(updated);
    updateExercise(updated);
  };

  if (!user) return <Login />;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Treino Tracker</h1>
      <button onClick={() => signOut(auth)}>Sair</button>
      <input
        type="text"
        placeholder="Novo exercício"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddExercise(e.target.value);
        }}
      />
      {loading ? (
        <p>Carregando...</p>
      ) : (
        exercises.map((ex) => (
          <Exercise key={ex.id} data={ex} onChange={handleUpdate} />
        ))
      )}
      <Graph data={exercises} />
    </div>
  );
}

export default App;
