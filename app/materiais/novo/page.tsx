"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoMaterialPage() {
  const router = useRouter();

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [unidade, setUnidade] = useState("");
  const [local, setLocal] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [observacao, setObservacao] = useState("");

  function salvarMaterial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      codigo.trim() === "" ||
      nome.trim() === "" ||
      unidade.trim() === "" ||
      local.trim() === ""
    ) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    const novoMaterial = {
      codigo: codigo.trim(),
      nome: nome.trim(),
      unidade: unidade.trim(),
      local: local.trim(),
      quantidade: Number(quantidade || 0),
      minimo: Number(estoqueMinimo || 0),
      observacao: observacao.trim(),
    };

    const materiaisSalvos = localStorage.getItem("stockcontrol_materiais");

    const materiais = materiaisSalvos
      ? JSON.parse(materiaisSalvos)
      : [];

    const codigoJaExiste = materiais.some(
      (material: { codigo: string }) =>
        material.codigo.toLowerCase() === novoMaterial.codigo.toLowerCase()
    );

    if (codigoJaExiste) {
      alert("Já existe um material cadastrado com esse código.");
      return;
    }

    materiais.push(novoMaterial);

    localStorage.setItem(
      "stockcontrol_materiais",
      JSON.stringify(materiais)
    );

    alert("Material cadastrado com sucesso.");

    router.push("/materiais");
  }

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
          marginBottom: "28px",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#0b5ed7",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          CADASTRO
        </p>

        <h1
          style={{
            margin: "8px 0 6px",
            color: "#172033",
          }}
        >
          Novo material
        </h1>

        <p
          style={{
            margin: 0,
            color: "#667085",
          }}
        >
          Preencha as informações do material.
        </p>
      </header>

      <form
        onSubmit={salvarMaterial}
        style={{
          maxWidth: "900px",
          padding: "24px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
          }}
        >
          <Campo
            label="Código"
            value={codigo}
            onChange={setCodigo}
            placeholder="Ex.: MAT-001"
            required
          />

          <Campo
            label="Nome do material"
            value={nome}
            onChange={setNome}
            placeholder="Ex.: Cimento"
            required
          />

          <Campo
            label="Unidade"
            value={unidade}
            onChange={setUnidade}
            placeholder="Ex.: unidade, caixa, metro"
            required
          />

          <Campo
            label="Local de armazenamento"
            value={local}
            onChange={setLocal}
            placeholder="Ex.: Torre 1 - Apartamento 1"
            required
          />

          <Campo
            label="Quantidade atual"
            value={quantidade}
            onChange={setQuantidade}
            placeholder="0"
            type="number"
          />

          <Campo
            label="Estoque mínimo"
            value={estoqueMinimo}
            onChange={setEstoqueMinimo}
            placeholder="0"
            type="number"
          />
        </div>

        <label
          style={{
            display: "grid",
            gap: "8px",
            marginTop: "18px",
            color: "#344054",
            fontWeight: "bold",
          }}
        >
          Observação

          <textarea
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
            placeholder="Informações adicionais sobre o material"
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d7deea",
              borderRadius: "10px",
              fontFamily: "Arial, sans-serif",
              fontSize: "16px",
              resize: "vertical",
            }}
          />
        </label>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "24px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/materiais")}
            style={{
              padding: "12px 18px",
              border: "1px solid #d7deea",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#344054",
              fontWeight: "bold",
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            style={{
              padding: "12px 18px",
              border: "none",
              borderRadius: "10px",
              background: "#0b5ed7",
              color: "#ffffff",
              fontWeight: "bold",
            }}
          >
            Salvar material
          </button>
        </div>
      </form>
    </main>
  );
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: "8px",
        color: "#344054",
        fontWeight: "bold",
      }}
    >
      {label}

      <input
        type={type}
        value={value}
        required={required}
        min={type === "number" ? "0" : undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #d7deea",
          borderRadius: "10px",
          fontSize: "16px",
        }}
      />
    </label>
  );
}
