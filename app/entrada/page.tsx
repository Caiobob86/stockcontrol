"use client";

import { useEffect, useMemo, useState } from "react";
import { listarMateriais } from "@/services/material";
import { listarLocais } from "@/services/local";

type Material = {
  id: string;
  codigo: string;
  nome: string;
  unidade: string;
  quantidade_atual: number;
};

type LocalEstoque = {
  id: string;
  nome: string;
  tipo: string;
  parent_id: string | null;
  ordem: number;
};

export default function EntradaPage() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [locais, setLocais] = useState<LocalEstoque[]>([]);

  const [materialId, setMaterialId] = useState("");
  const [estoquePrincipal, setEstoquePrincipal] = useState("");
  const [subEstoque, setSubEstoque] = useState("");
  const [apartamento, setApartamento] = useState("");

  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const listaMateriais = await listarMateriais();
      const listaLocais = await listarLocais();

      setMateriais(listaMateriais);
      setLocais(listaLocais);
    } catch (erro) {
      console.error(erro);
      alert("Erro ao carregar dados.");
    }
  }

  const estoquesPrincipais = useMemo(() => {
    return locais.filter((item) => item.tipo === "principal");
  }, [locais]);

  const subEstoques = useMemo(() => {
    return locais.filter(
      (item) =>
        item.parent_id === estoquePrincipal &&
        item.tipo !== "apartamento"
    );
  }, [locais, estoquePrincipal]);

  const apartamentos = useMemo(() => {
    const pai = subEstoque || estoquePrincipal;

    return locais.filter(
      (item) =>
        item.parent_id === pai &&
        item.tipo === "apartamento"
    );
  }, [locais, estoquePrincipal, subEstoque]);
    async function registrarEntrada() {
    if (!materialId) {
      alert("Selecione um material.");
      return;
    }

    if (!estoquePrincipal) {
      alert("Selecione o estoque principal.");
      return;
    }

    if (quantidade <= 0) {
      alert("Informe uma quantidade válida.");
      return;
    }

    try {
      alert("Entrada registrada com sucesso!");

      setMaterialId("");
      setEstoquePrincipal("");
      setSubEstoque("");
      setApartamento("");
      setQuantidade(1);

      carregarDados();
    } catch (erro) {
      console.error(erro);
      alert("Erro ao registrar entrada.");
    }
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>Entrada de Materiais</h1>

      <p>Registrar entrada de materiais no estoque.</p>

      <div
        style={{
          marginTop: "30px",
          padding: "25px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fafafa",
        }}
      >
        <h2>Registrar Entrada</h2>

        <p>Material</p>

        <select
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <option value="">Selecione...</option>

          {materiais.map((item) => (
            <option key={item.id} value={item.id}>
              {item.codigo} - {item.nome}
            </option>
          ))}
        </select>

        <p>Estoque Principal</p>

        <select
          value={estoquePrincipal}
          onChange={(e) => {
            setEstoquePrincipal(e.target.value);
            setSubEstoque("");
            setApartamento("");
          }}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <option value="">Selecione...</option>

          {estoquesPrincipais.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </select>
                {subEstoques.length > 0 && (
          <>
            <p>Subestoque</p>

            <select
              value={subEstoque}
              onChange={(e) => {
                setSubEstoque(e.target.value);
                setApartamento("");
              }}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
              }}
            >
              <option value="">Selecione...</option>

              {subEstoques.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </>
        )}

        {apartamentos.length > 0 && (
          <>
            <p>Apartamento</p>

            <select
              value={apartamento}
              onChange={(e) => setApartamento(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
              }}
            >
              <option value="">Selecione...</option>

              {apartamentos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </>
        )}

        <p>Quantidade</p>

        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "25px",
          }}
        />
                <button
          type="button"
          onClick={registrarEntrada}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "10px",
            background: "#2563eb",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Registrar Entrada
        </button>
      </div>
    </main>
  );
}