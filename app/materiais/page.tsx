"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Material = {
  id: string;
  codigo: string;
  nome: string;
  unidade: string;
  estoqueMinimo: number;
  quantidadeAtual: number;
  observacao: string;
  ativo: boolean;
};

const STORAGE_KEY = "stockcontrol_materiais";

const vazio = {
  codigo: "",
  nome: "",
  unidade: "UN",
  estoqueMinimo: "",
  quantidadeAtual: "",
  observacao: "",
};

export default function MateriaisPage() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [busca, setBusca] = useState("");
  const [formulario, setFormulario] = useState(vazio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    try {
      const dados = localStorage.getItem(STORAGE_KEY);
      if (dados) setMateriais(JSON.parse(dados));
    } catch {
      setMensagem("Não foi possível carregar os materiais.");
    }
  }, []);

  function salvarLista(lista: Material[]) {
    setMateriais(lista);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    window.dispatchEvent(new Event("stockcontrol-atualizado"));
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    setMensagem("");

    const codigo = formulario.codigo.trim();
    const nome = formulario.nome.trim();

    if (!codigo || !nome || !formulario.unidade.trim()) {
      setMensagem("Preencha código, nome e unidade.");
      return;
    }

    const duplicado = materiais.some(
      (item) =>
        item.codigo.toLowerCase() === codigo.toLowerCase() &&
        item.id !== editandoId
    );

    if (duplicado) {
      setMensagem("Já existe um material com esse código.");
      return;
    }

    const material: Material = {
      id: editandoId ?? crypto.randomUUID(),
      codigo,
      nome,
      unidade: formulario.unidade.trim().toUpperCase(),
      estoqueMinimo: Number(formulario.estoqueMinimo) || 0,
      quantidadeAtual: Number(formulario.quantidadeAtual) || 0,
      observacao: formulario.observacao.trim(),
      ativo: true,
    };

    const novaLista = editandoId
      ? materiais.map((item) =>
          item.id === editandoId ? { ...material, ativo: item.ativo } : item
        )
      : [material, ...materiais];

    salvarLista(novaLista);
    setFormulario(vazio);
    setEditandoId(null);
    setMensagem(editandoId ? "Material atualizado." : "Material cadastrado.");
  }

  function editar(material: Material) {
    setFormulario({
      codigo: material.codigo,
      nome: material.nome,
      unidade: material.unidade,
      estoqueMinimo: String(material.estoqueMinimo),
      quantidadeAtual: String(material.quantidadeAtual),
      observacao: material.observacao,
    });
    setEditandoId(material.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function alterarSituacao(material: Material) {
    const novaLista = materiais.map((item) =>
      item.id === material.id ? { ...item, ativo: !item.ativo } : item
    );
    salvarLista(novaLista);
    setMensagem(material.ativo ? "Material inativado." : "Material reativado.");
  }

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return materiais;

    return materiais.filter(
      (item) =>
        item.codigo.toLowerCase().includes(termo) ||
        item.nome.toLowerCase().includes(termo)
    );
  }, [busca, materiais]);

  return (
    <main style={styles.pagina}>
      <header style={styles.cabecalho}>
        <div>
          <p style={styles.rotulo}>CONTROLE DE ESTOQUE</p>
          <h1 style={styles.titulo}>Materiais</h1>
          <p style={styles.subtitulo}>
            Cadastre, pesquise e mantenha os materiais do almoxarifado.
          </p>
        </div>

        <Link href="/dashboard" style={styles.voltar}>
          Voltar ao Dashboard
        </Link>
      </header>

      <section style={styles.cartao}>
        <h2 style={styles.tituloSecao}>
          {editandoId ? "Editar material" : "Novo material"}
        </h2>

        <form onSubmit={enviar} style={styles.formulario}>
          <Campo
            titulo="Código"
            valor={formulario.codigo}
            alterar={(valor) =>
              setFormulario({ ...formulario, codigo: valor })
            }
            obrigatorio
          />

          <Campo
            titulo="Nome do material"
            valor={formulario.nome}
            alterar={(valor) => setFormulario({ ...formulario, nome: valor })}
            obrigatorio
          />

          <Campo
            titulo="Unidade"
            valor={formulario.unidade}
            alterar={(valor) =>
              setFormulario({ ...formulario, unidade: valor })
            }
            obrigatorio
          />

          <Campo
            titulo="Estoque mínimo"
            valor={formulario.estoqueMinimo}
            alterar={(valor) =>
              setFormulario({ ...formulario, estoqueMinimo: valor })
            }
            tipo="number"
          />

          <Campo
            titulo="Quantidade atual"
            valor={formulario.quantidadeAtual}
            alterar={(valor) =>
              setFormulario({ ...formulario, quantidadeAtual: valor })
            }
            tipo="number"
          />

          <label style={styles.campoGrande}>
            <span style={styles.label}>Observação</span>
            <textarea
              value={formulario.observacao}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  observacao: evento.target.value,
                })
              }
              rows={3}
              style={styles.input}
            />
          </label>

          <div style={styles.acoesFormulario}>
            <button type="submit" style={styles.botaoPrimario}>
              {editandoId ? "Salvar alterações" : "Cadastrar material"}
            </button>

            {editandoId && (
              <button
                type="button"
                style={styles.botaoSecundario}
                onClick={() => {
                  setEditandoId(null);
                  setFormulario(vazio);
                  setMensagem("");
                }}
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>

        {mensagem && <p style={styles.mensagem}>{mensagem}</p>}
      </section>

      <section style={styles.cartao}>
        <div style={styles.barraLista}>
          <div>
            <h2 style={styles.tituloSecao}>Materiais cadastrados</h2>
            <p style={styles.contador}>{materiais.length} material(is)</p>
          </div>

          <input
            type="search"
            placeholder="Pesquisar por código ou nome"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            style={styles.pesquisa}
          />
        </div>

        <div style={styles.lista}>
          {filtrados.length === 0 ? (
            <div style={styles.vazio}>
              Nenhum material encontrado.
            </div>
          ) : (
            filtrados.map((material) => {
              const baixo =
                material.quantidadeAtual <= material.estoqueMinimo;

              return (
                <article
                  key={material.id}
                  style={{
                    ...styles.item,
                    opacity: material.ativo ? 1 : 0.58,
                  }}
                >
                  <div style={styles.itemTopo}>
                    <div>
                      <strong style={styles.nomeMaterial}>
                        {material.nome}
                      </strong>
                      <div style={styles.codigo}>{material.codigo}</div>
                    </div>

                    <span
                      style={{
                        ...styles.situacao,
                        background: material.ativo ? "#dcfce7" : "#e5e7eb",
                        color: material.ativo ? "#166534" : "#374151",
                      }}
                    >
                      {material.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div style={styles.dados}>
                    <span>
                      <b>Unidade:</b> {material.unidade}
                    </span>
                    <span>
                      <b>Quantidade:</b> {material.quantidadeAtual}
                    </span>
                    <span>
                      <b>Mínimo:</b> {material.estoqueMinimo}
                    </span>
                  </div>

                  {baixo && material.ativo && (
                    <p style={styles.alerta}>⚠ Estoque baixo</p>
                  )}

                  {material.observacao && (
                    <p style={styles.observacao}>{material.observacao}</p>
                  )}

                  <div style={styles.acoesItem}>
                    <button
                      type="button"
                      onClick={() => editar(material)}
                      style={styles.botaoEditar}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => alterarSituacao(material)}
                      style={styles.botaoSituacao}
                    >
                      {material.ativo ? "Inativar" : "Reativar"}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

function Campo({
  titulo,
  valor,
  alterar,
  tipo = "text",
  obrigatorio = false,
}: {
  titulo: string;
  valor: string;
  alterar: (valor: string) => void;
  tipo?: string;
  obrigatorio?: boolean;
}) {
  return (
    <label style={styles.campo}>
      <span style={styles.label}>{titulo}</span>
      <input
        type={tipo}
        min={tipo === "number" ? "0" : undefined}
        step={tipo === "number" ? "any" : undefined}
        value={valor}
        required={obrigatorio}
        onChange={(evento) => alterar(evento.target.value)}
        style={styles.input}
      />
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pagina: {
    minHeight: "100vh",
    background: "#f3f6fb",
    padding: "clamp(18px, 4vw, 48px)",
    color: "#172033",
    fontFamily: "Arial, sans-serif",
  },
  cabecalho: {
    maxWidth: "1180px",
    margin: "0 auto 24px",
    display: "flex",
    gap: "20px",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  rotulo: {
    color: "#075dcc",
    fontSize: "13px",
    fontWeight: 800,
    margin: "0 0 8px",
  },
  titulo: {
    fontSize: "clamp(30px, 5vw, 46px)",
    margin: 0,
  },
  subtitulo: {
    color: "#62708a",
    margin: "8px 0 0",
  },
  voltar: {
    color: "#075dcc",
    fontWeight: 700,
    textDecoration: "none",
    padding: "14px 18px",
    border: "1px solid #bfd1ea",
    borderRadius: "12px",
    background: "white",
  },
  cartao: {
    maxWidth: "1180px",
    margin: "0 auto 24px",
    background: "white",
    padding: "clamp(18px, 3vw, 30px)",
    borderRadius: "20px",
    boxShadow: "0 12px 35px rgba(28, 48, 80, 0.08)",
  },
  tituloSecao: {
    margin: 0,
    fontSize: "22px",
  },
  formulario: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
    marginTop: "22px",
  },
  campo: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  campoGrande: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    gridColumn: "1 / -1",
  },
  label: {
    fontWeight: 700,
    fontSize: "14px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "48px",
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    padding: "12px 14px",
    fontSize: "16px",
    background: "white",
  },
  acoesFormulario: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  botaoPrimario: {
    border: 0,
    borderRadius: "11px",
    padding: "14px 20px",
    minHeight: "48px",
    background: "#075dcc",
    color: "white",
    fontSize: "16px",
    fontWeight: 700,
  },
  botaoSecundario: {
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    padding: "14px 20px",
    minHeight: "48px",
    background: "white",
    color: "#172033",
    fontSize: "16px",
    fontWeight: 700,
  },
  mensagem: {
    background: "#eef6ff",
    color: "#075dcc",
    borderRadius: "10px",
    padding: "12px",
    margin: "18px 0 0",
    fontWeight: 700,
  },
  barraLista: {
    display: "flex",
    gap: "20px",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  contador: {
    margin: "6px 0 0",
    color: "#64748b",
  },
  pesquisa: {
    width: "min(100%, 360px)",
    minHeight: "48px",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    fontSize: "16px",
  },
  lista: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: "16px",
    marginTop: "22px",
  },
  item: {
    border: "1px solid #dbe4ef",
    borderRadius: "16px",
    padding: "18px",
    background: "#fbfdff",
  },
  itemTopo: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },
  nomeMaterial: {
    fontSize: "18px",
  },
  codigo: {
    color: "#64748b",
    marginTop: "5px",
  },
  situacao: {
    height: "fit-content",
    padding: "6px 9px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
  },
  dados: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "17px",
    color: "#46536a",
  },
  alerta: {
    color: "#b45309",
    background: "#fff7ed",
    padding: "9px",
    borderRadius: "9px",
    fontWeight: 800,
  },
  observacao: {
    color: "#64748b",
    lineHeight: 1.5,
  },
  acoesItem: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  },
  botaoEditar: {
    border: 0,
    background: "#075dcc",
    color: "white",
    borderRadius: "9px",
    padding: "11px 15px",
    fontWeight: 700,
  },
  botaoSituacao: {
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#334155",
    borderRadius: "9px",
    padding: "11px 15px",
    fontWeight: 700,
  },
  vazio: {
    gridColumn: "1 / -1",
    padding: "32px",
    textAlign: "center",
    color: "#64748b",
    border: "1px dashed #cbd5e1",
    borderRadius: "14px",
  },
};
