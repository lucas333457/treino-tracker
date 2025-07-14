// src/components/Login.js
import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Faça login para continuar</h2>
      <button onClick={login}>Entrar com Google</button>
    </div>
  );
}

export default Login;
