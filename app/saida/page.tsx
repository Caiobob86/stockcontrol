"use client";

import { useState } from "react";
import { materiais, locais } from "../../lib/database";

export default function SaidaPage() {
  const [material, setMaterial] = useState("");
  const [local, setLocal] = useState("");
  const [quantidade, setQuantidade] = useState(0);

  function registrarSaida() {
  const materialSelecionado = materiais.find(
    (m) => m.id === material
  );

  if (!materialSelecionado) {
    alert("Selecione um material.");
    return;
  }

  if (quantidade <= 0) {
    alert("Informe uma quantidade válida.");
    return;
  }

  if (materialSelecionado.quantidadeAtual < quantidade) {
    alert("Estoque insuficiente.");
    return;
  }

  materialSelecionado.quantidadeAtual -= quantidade;

  alert(
    `Saída registrada!\n\nNovo estoque: ${materialSelecionado.quantidadeAtual}`
  );

  setQuantidade(0);
}

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <small
        style={{
          color: "#2563eb",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        CONTROLE DE ESTOQUE
      </small>

      <h1 style={{ fontSize: "48px", marginTop: "10px" }}>
        Saída de Materiais
      </h1>

      <p style={{ color: "#666", marginBottom: "30px" }}>
        Registrar saída de materiais.
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "24px",
          background: "#fafafa",
        }}
      >
        <h2>Registrar Saída</h2>

        <p>Material</p>

        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        >
          {materiais.map((material) => (
            <option key={material.id} value={material.id}>
              {material.codigo} - {material.nome}
            </option>
          ))}
        </select>

        <p>Local do estoque</p>

        <select
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        >
          {locais.map((local) => (
            <option key={local.id} value={local.id}>
              {local.nome}
            </option>
          ))}
        </select>

        <p>Quantidade</p>

        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={registrarSaida}
          style={{
            padding: "12px 20px",
            background: "#dc2626",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Registrar Saída
        </button>
      </div>
    </main>
  );
}