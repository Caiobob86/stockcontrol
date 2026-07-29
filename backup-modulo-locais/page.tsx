"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LocalEstoque = {
  nome: string;
  tipo: string;
  subdivisoes?: string[];
};

const locaisIniciais: LocalEstoque[] = [
  ...Array.from({ length: 7 }, (_, indice) => ({
    nome: `Torre ${indice + 1}`,
    tipo: "Torre",
    subdivisoes: [
      "Apartamento 1",
      "Apartamento 2",
      "Apartamento 3",
      "Apartamento 4",
    ],
  })),
  {
    nome: "Almoxarifado",
    tipo: "Área de estoque",
  },
  {
    nome: "Baia de Tubos",
    tipo: "Baia",
  },
  {
    nome: "Baia de Químicos",
    tipo: "Baia",
  },
  {
    nome: "Cofre",
    tipo: "Área restrita",
  },
  {
    nome: "Área Externa",
    tipo: "Área de estoque",
  },
];

export default function EstoquesPage() {
  const router = useRouter();
  const [busca, setBusca] = useState("");

  const locaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return locaisIniciais;
    }

    return locaisIniciais.filter((local) => {
      const nomeEncontrado = local.nome.toLowerCase().includes(termo);
      const tipoEncontrado = local.tipo.toLowerCase().includes(termo);
      const subdivisaoEncontrada = local.subdivisoes?.some((subdivisao) =>
        subdivisao.toLowerCase().includes(termo)
      );

      return nomeEncontrado || tipoEncontrado || subdivisaoEncontrada;
    });
  }, [busca]);

  const totalLocais =
    locaisIniciais.filter((local) => local.subdivisoes).length * 4 +
    locaisIniciais.filter((local) => !local.subdivisoes).length;

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
          flexWrap: "wrap",
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
            ORGANIZAÇÃO FÍSICA
          </p>

          <h1
            style={{
              margin: "8px 0 6px",
              color: "#172033",
            }}
          >
            Estoques
          </h1>

          <p
            style={{
              margin: 0,
              color: "#667085",
            }}
          >
            {totalLocais} locais de armazenamento cadastrados.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{
            padding: "12px 18px",
            border: "1px solid #d7deea",
            borderRadius: "10px",
            background: "#ffffff",
            color: "#344054",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Voltar ao Dashboard
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
          placeholder="Pesquisar torre, apartamento ou área"
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          {locaisFiltrados.map((local) => (
            <article
              key={local.nome}
              style={{
                padding: "20px",
                border: "1px solid #d7deea",
                borderRadius: "14px",
                background: "#ffffff",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  marginBottom: "12px",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  background: "#eaf2ff",
                  color: "#0b5ed7",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {local.tipo}
              </span>

              <h2
                style={{
                  margin: "0 0 12px",
                  color: "#172033",
                  fontSize: "20px",
                }}
              >
                {local.nome}
              </h2>

              {local.subdivisoes ? (
                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  {local.subdivisoes.map((subdivisao) => (
                    <div
                      key={subdivisao}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "9px",
                        background: "#f4f7fb",
                        color: "#344054",
                      }}
                    >
                      {subdivisao}
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    margin: 0,
                    color: "#667085",
                  }}
                >
                  Local independente de armazenamento.
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
