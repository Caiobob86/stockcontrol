"use client";

import { useState } from "react";

type Material = {
  codigo: string;
  nome: string;
  unidade: string;
  quantidade: number;
  minimo: number;
  local: string;
};

export default function MateriaisPage() {
  const [busca, setBusca] = useState("");
  const [materiais] = useState<Material[]>([]);

  const materiaisFiltrados = materiais.filter((material) => {
    const termo = busca.toLowerCase();

    return (
      material.codigo.toLowerCase().includes(termo) ||
      material.nome.toLowerCase().includes(termo)
    );
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#0b5ed7",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            CADASTRO GERAL
          </p>

          <h1
            style={{
              margin: "8px 0 0",
              color: "#172033",
            }}
          >
            Materiais
          </h1>
        </div>

        <button
          type="button"
          style={{
            padding: "12px 18px",
            border: "none",
            borderRadius: "10px",
            background: "#0b5ed7",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          Novo material
        </button>
      </header>

      <section
        style={{
          padding: "24px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        <input
          type="search"
          placeholder="Pesquisar por código ou nome"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "22px",
            border: "1px solid #d7deea",
            borderRadius: "10px",
            fontSize: "16px",
          }}
        />

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: "760px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={cabecalho}>Código</th>
                <th style={cabecalho}>Material</th>
                <th style={cabecalho}>Unidade</th>
                <th style={cabecalho}>Local</th>
                <th style={cabecalho}>Quantidade</th>
                <th style={cabecalho}>Estoque mínimo</th>
              </tr>
            </thead>

            <tbody>
              {materiaisFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "50px 16px",
                      textAlign: "center",
                      color: "#667085",
                    }}
                  >
                    Nenhum material cadastrado.
                  </td>
                </tr>
              ) : (
                materiaisFiltrados.map((material) => (
                  <tr key={material.codigo}>
                    <td style={celula}>{material.codigo}</td>
                    <td style={celula}>{material.nome}</td>
                    <td style={celula}>{material.unidade}</td>
                    <td style={celula}>{material.local}</td>
                    <td style={celula}>{material.quantidade}</td>
                    <td style={celula}>{material.minimo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

const cabecalho = {
  padding: "14px 12px",
  borderBottom: "1px solid #d7deea",
  textAlign: "left" as const,
  color: "#667085",
  fontSize: "13px",
};

const celula = {
  padding: "14px 12px",
  borderBottom: "1px solid #e8edf4",
  color: "#172033",
};
