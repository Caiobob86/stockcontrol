"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function entrar(e: React.FormEvent) {
    e.preventDefault();

    if (email !== "" && senha !== "") {
      router.push("/dashboard");
    } else {
      alert("Preencha o e-mail e a senha.");
    }
  }

  return (
    <main
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: 20,
        fontFamily: "Arial"
      }}
    >
      <h1>StockControl</h1>
      <p>Controle de Materiais</p>

      <form onSubmit={entrar}>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{
            width:"100%",
            padding:12,
            marginBottom:10
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e)=>setSenha(e.target.value)}
          style={{
            width:"100%",
            padding:12,
            marginBottom:20
          }}
        />

        <button
          style={{
            width:"100%",
            padding:12,
            background:"#0B5ED7",
            color:"#fff",
            border:"none",
            borderRadius:6
          }}
        >
          Entrar
        </button>

      </form>

    </main>
  );
}
