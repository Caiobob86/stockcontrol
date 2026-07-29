"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type LocalEstoque = {
  id: string;
  nome: string;
  grupo: string;
  tipo: string;
  observacao: string;
  ativo: boolean;
  padrao: boolean;
};

type FormularioLocal = {
  nome: string;
  grupo: string;
  tipo: string;
  observacao: string;
};

const STORAGE_KEY = "stockcontrol_locais";

const formularioVazio: FormularioLocal = {
  nome: "",
  grupo: "",
  tipo: "Outro",
  observacao: "",
};

function criarLocaisIniciais(): LocalEstoque[] {
  const locais: LocalEstoque[] = [];

  for (let torre = 1; torre <= 7; torre++) {
    for (let apartamento = 1; apartamento <= 4; apartamento++) {
      locais.push({
        id: `torre-${torre}-apartamento-${apartamento}`,
        nome: `Apartamento ${apartamento}`,
        grupo: `Torre ${torre}`,
        tipo: "Apartamento",
        observacao: "",
        ativo: true,
        padrao: true,
      });
    }
  }

  locais.push(
    {
      id: "almoxarifado",
      nome: "Almoxarifado",
      grupo: "Áreas gerais",
      tipo: "Almoxarifado",
      observacao: "",
      ativo: true,
      padrao: true,
    },
    {
      id: "baia-de-tubos",
      nome: "Baia de Tubos",
      grupo: "Áreas gerais",
      tipo: "Baia",
      observacao: "",
      ativo: true,
      padrao: true,
    },
    {
      id: "baia-de-quimicos",
      nome: "Baia de Químicos",
      grupo: "Áreas gerais",
      tipo: "Baia",
      observacao: "",
      ativo: true,
      padrao: true,
    },
    {
      id: "cofre",
      nome: "Cofre",
      grupo: "Áreas gerais",
      tipo: "Cofre",
      observacao: "",
      ativo: true,
      padrao: true,
    },
    {
      id: "area-externa",
      nome: "Área Externa",
      grupo: "Áreas gerais",
      tipo: "Área externa",
      observacao: "",
      ativo: true,
      padrao: true,
    }
  );

  return locais;
}

export default function EstoquesPage() {
  const [locais, setLocais] = useState<LocalEstoque[]>([]);
  const [busca, setBusca] = useState("");
  const [formulario, setFormulario] =
    useState<FormularioLocal>(formularioVazio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    try {
      const dadosSalvos = localStorage.getItem(STORAGE_KEY);

      if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos) as LocalEstoque[];
        setLocais(dados);
        return;
      }

      const iniciais = criarLocaisIniciais();
      setLocais(iniciais);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(iniciais));
    } catch {
      setMensagem("Não foi possível carregar os locais de estoque.");
    }
  }, []);

  function salvarLista(novaLista: LocalEstoque[]) {
    setLocais(novaLista);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
    window.dispatchEvent(new Event("stockcontrol-atualizado"));
  }

  function salvarLocal(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagem("");

    const nome = formulario.nome.trim();
    const grupo = formulario.grupo.trim();
    const tipo = formulario.tipo.trim();

    if (!nome || !grupo || !tipo) {
      setMensagem("Preencha nome, grupo e tipo do local.");
      return;
    }

    const duplicado = locais.some(
      (local) =>
        local.nome.toLowerCase() === nome.toLowerCase() &&
        local.grupo.toLowerCase() === grupo.toLowerCase() &&
        local.id !== editandoId
    );

    if (duplicado) {
      setMensagem("Já existe um local com esse nome dentro desse grupo.");
      return;
    }

    if (editandoId) {
      const atualizados = locais.map((local) =>
        local.id === editandoId
          ? {
              ...local,
              nome,
              grupo,
              tipo,
              observacao: formulario.observacao.trim(),
            }
          : local
      );

      salvarLista(atualizados);
      setMensagem("Local atualizado com sucesso.");
    } else {
      const novoLocal: LocalEstoque = {
        id: crypto.randomUUID(),
        nome,
        grupo,
        tipo,
        observacao: formulario.observacao.trim(),
        ativo: true,
        padrao: false,
      };

      salvarLista([...locais, novoLocal]);
      setMensagem("Novo local cadastrado com sucesso.");
    }

    setFormulario(formularioVazio);
    setEditandoId(null);
  }

  function editarLocal(local: LocalEstoque) {
    setFormulario({
      nome: local.nome,
      grupo: local.grupo,
      tipo: local.tipo,
      observacao: local.observacao,
    });

    setEditandoId(local.id);
    setMensagem("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function alterarSituacao(local: LocalEstoque) {
    const atualizados = locais.map((item) =>
      item.id === local.id ? { ...item, ativo: !item.ativo } : item
    );

    salvarLista(atualizados);
    setMensagem(local.ativo ? "Local inativado." : "Local reativado.");
  }

  const locaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return locais;

    return locais.filter(
      (local) =>
        local.nome.toLowerCase().includes(termo) ||
        local.grupo.toLowerCase().includes(termo) ||
        local.tipo.toLowerCase().includes(termo)
    );
  }, [busca, locais]);

  const grupos = useMemo(() => {
    const resultado = new Map<string, LocalEstoque[]>();

    locaisFiltrados.forEach((local) => {
      const existentes = resultado.get(local.grupo) ?? [];
      resultado.set(local.grupo, [...existentes, local]);
    });

    return Array.from(resultado.entries()).sort(([grupoA], [grupoB]) =>
      grupoA.localeCompare(grupoB, "pt-BR", { numeric: true })
    );
  }, [locaisFiltrados]);

  const ativos = locais.filter((local) => local.ativo).length;

  return (
    <main style={styles.pagina}>
      <header style={styles.cabecalho}>
        <div>
          <p style={styles.rotulo}>CONTROLE DE ESTOQUE</p>
          <h1 style={styles.titulo}>Locais de estoque</h1>
          <p style={styles.subtitulo}>
            Organize torres, apartamentos, baias, cofre e novas áreas.
          </p>
        </div>

        <Link href="/dashboard" style={styles.voltar}>
          Voltar ao Dashboard
        </Link>
      </header>

      <section style={styles.resumo}>
        <div style={styles.resumoItem}>
          <span style={styles.resumoRotulo}>Total de locais</span>
          <strong style={styles.resumoNumero}>{locais.length}</strong>
        </div>

        <div style={styles.resumoItem}>
          <span style={styles.resumoRotulo}>Locais ativos</span>
          <strong style={styles.resumoNumero}>{ativos}</strong>
        </div>

        <div style={styles.resumoItem}>
          <span style={styles.resumoRotulo}>Locais inativos</span>
          <strong style={styles.resumoNumero}>
            {locais.length - ativos}
          </strong>
        </div>
      </section>

      <section style={styles.cartao}>
        <h2 style={styles.tituloSecao}>
          {editandoId ? "Editar local" : "Adicionar novo local"}
        </h2>

        <form onSubmit={salvarLocal} style={styles.formulario}>
          <Campo
            titulo="Nome do local"
            valor={formulario.nome}
            alterar={(valor) =>
              setFormulario({ ...formulario, nome: valor })
            }
            placeholder="Ex.: Depósito Central"
          />

          <Campo
            titulo="Grupo"
            valor={formulario.grupo}
            alterar={(valor) =>
              setFormulario({ ...formulario, grupo: valor })
            }
            placeholder="Ex.: Torre 8 ou Áreas gerais"
          />

          <label style={styles.campo}>
            <span style={styles.label}>Tipo</span>
            <select
              value={formulario.tipo}
              onChange={(evento) =>
                setFormulario({
                  ...formulario,
                  tipo: evento.target.value,
                })
              }
              style={styles.input}
            >
              <option>Apartamento</option>
              <option>Almoxarifado</option>
              <option>Baia</option>
              <option>Cofre</option>
              <option>Depósito</option>
              <option>Área externa</option>
              <option>Outro</option>
            </select>
          </label>

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
              placeholder="Informações adicionais sobre o local"
            />
          </label>

          <div style={styles.acoesFormulario}>
            <button type="submit" style={styles.botaoPrimario}>
              {editandoId ? "Salvar alterações" : "Cadastrar local"}
            </button>

            {editandoId && (
              <button
                type="button"
                style={styles.botaoSecundario}
                onClick={() => {
                  setEditandoId(null);
                  setFormulario(formularioVazio);
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
            <h2 style={styles.tituloSecao}>Locais cadastrados</h2>
            <p style={styles.textoApoio}>
              Os 33 locais iniciais já estão disponíveis.
            </p>
          </div>

          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Pesquisar local, grupo ou tipo"
            style={styles.pesquisa}
          />
        </div>

        {grupos.length === 0 ? (
          <div style={styles.vazio}>Nenhum local encontrado.</div>
        ) : (
          <div style={styles.grupos}>
            {grupos.map(([grupo, locaisDoGrupo]) => (
              <div key={grupo} style={styles.grupo}>
                <div style={styles.grupoCabecalho}>
                  <h3 style={styles.grupoTitulo}>{grupo}</h3>
                  <span style={styles.grupoQuantidade}>
                    {locaisDoGrupo.length} local(is)
                  </span>
                </div>

                <div style={styles.lista}>
                  {locaisDoGrupo.map((local) => (
                    <article
                      key={local.id}
                      style={{
                        ...styles.item,
                        opacity: local.ativo ? 1 : 0.55,
                      }}
                    >
                      <div style={styles.itemTopo}>
                        <div>
                          <strong style={styles.nomeLocal}>
                            {local.nome}
                          </strong>
                          <p style={styles.tipo}>{local.tipo}</p>
                        </div>

                        <span
                          style={{
                            ...styles.situacao,
                            background: local.ativo
                              ? "#dcfce7"
                              : "#e5e7eb",
                            color: local.ativo ? "#166534" : "#374151",
                          }}
                        >
                          {local.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>

                      {local.observacao && (
                        <p style={styles.observacao}>{local.observacao}</p>
                      )}

                      <div style={styles.acoesItem}>
                        <button
                          type="button"
                          onClick={() => editarLocal(local)}
                          style={styles.botaoEditar}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => alterarSituacao(local)}
                          style={styles.botaoSituacao}
                        >
                          {local.ativo ? "Inativar" : "Reativar"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Campo({
  titulo,
  valor,
  alterar,
  placeholder,
}: {
  titulo: string;
  valor: string;
  alterar: (valor: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={styles.campo}>
      <span style={styles.label}>{titulo}</span>
      <input
        value={valor}
        required
        onChange={(evento) => alterar(evento.target.value)}
        placeholder={placeholder}
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
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  rotulo: {
    margin: "0 0 8px",
    color: "#075dcc",
    fontSize: "13px",
    fontWeight: 800,
  },
  titulo: {
    margin: 0,
    fontSize: "clamp(30px, 5vw, 46px)",
  },
  subtitulo: {
    margin: "8px 0 0",
    color: "#62708a",
  },
  voltar: {
    padding: "14px 18px",
    background: "white",
    border: "1px solid #bfd1ea",
    borderRadius: "12px",
    color: "#075dcc",
    fontWeight: 700,
    textDecoration: "none",
  },
  resumo: {
    maxWidth: "1180px",
    margin: "0 auto 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  resumoItem: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(28, 48, 80, 0.07)",
  },
  resumoRotulo: {
    display: "block",
    color: "#64748b",
    marginBottom: "8px",
  },
  resumoNumero: {
    fontSize: "30px",
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
  textoApoio: {
    margin: "6px 0 0",
    color: "#64748b",
  },
  formulario: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    background: "white",
    fontSize: "16px",
  },
  acoesFormulario: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  botaoPrimario: {
    minHeight: "48px",
    padding: "14px 20px",
    border: 0,
    borderRadius: "11px",
    background: "#075dcc",
    color: "white",
    fontSize: "16px",
    fontWeight: 700,
  },
  botaoSecundario: {
    minHeight: "48px",
    padding: "14px 20px",
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    background: "white",
    color: "#172033",
    fontSize: "16px",
    fontWeight: 700,
  },
  mensagem: {
    margin: "18px 0 0",
    padding: "12px",
    borderRadius: "10px",
    background: "#eef6ff",
    color: "#075dcc",
    fontWeight: 700,
  },
  barraLista: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  pesquisa: {
    width: "min(100%, 370px)",
    minHeight: "48px",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    fontSize: "16px",
  },
  grupos: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    marginTop: "24px",
  },
  grupo: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "20px",
  },
  grupoCabecalho: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  grupoTitulo: {
    margin: 0,
    fontSize: "20px",
  },
  grupoQuantidade: {
    color: "#64748b",
    fontSize: "14px",
  },
  lista: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "14px",
    marginTop: "15px",
  },
  item: {
    padding: "17px",
    border: "1px solid #dbe4ef",
    borderRadius: "15px",
    background: "#fbfdff",
  },
  itemTopo: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },
  nomeLocal: {
    fontSize: "17px",
  },
  tipo: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },
  situacao: {
    height: "fit-content",
    padding: "6px 9px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
  },
  observacao: {
    color: "#64748b",
    lineHeight: 1.5,
  },
  acoesItem: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  botaoEditar: {
    padding: "10px 14px",
    border: 0,
    borderRadius: "9px",
    background: "#075dcc",
    color: "white",
    fontWeight: 700,
  },
  botaoSituacao: {
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    background: "white",
    color: "#334155",
    fontWeight: 700,
  },
  vazio: {
    marginTop: "22px",
    padding: "32px",
    border: "1px dashed #cbd5e1",
    borderRadius: "14px",
    color: "#64748b",
    textAlign: "center",
  },
};
