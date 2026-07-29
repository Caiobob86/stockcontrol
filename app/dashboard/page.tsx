export default function DashboardPage() {
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
          gap: "20px",
          marginBottom: "32px",
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
            VISÃO GERAL
          </p>

          <h1
            style={{
              margin: "8px 0 0",
              color: "#172033",
            }}
          >
            Dashboard
          </h1>
        </div>

        <strong
          style={{
            color: "#0b5ed7",
            fontSize: "20px",
          }}
        >
          StockControl
        </strong>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <Card titulo="Total de materiais" valor="0" />
        <Card titulo="Locais de estoque" valor="28" />
        <Card titulo="Entradas hoje" valor="0" />
        <Card titulo="Saídas hoje" valor="0" />
        <Card titulo="Estoque baixo" valor="0" />
      </section>

      <section
        style={{
          padding: "24px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#172033",
          }}
        >
          Acesso rápido
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "14px",
          }}
        >
          <Botao nome="Materiais" />
          <Botao nome="Estoques" />
          <Botao nome="Entrada" />
          <Botao nome="Saída" />
          <Botao nome="Transferência" />
          <Botao nome="Inventário" />
        </div>
      </section>
    </main>
  );
}

function Card({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <article
      style={{
        padding: "20px",
        background: "#ffffff",
        borderRadius: "14px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <p
        style={{
          margin: "0 0 10px",
          color: "#667085",
        }}
      >
        {titulo}
      </p>

      <strong
        style={{
          fontSize: "30px",
          color: "#172033",
        }}
      >
        {valor}
      </strong>
    </article>
  );
}

function Botao({ nome }: { nome: string }) {
  return (
    <button
      type="button"
      style={{
        minHeight: "72px",
        padding: "16px",
        border: "1px solid #d7deea",
        borderRadius: "12px",
        background: "#ffffff",
        color: "#0b5ed7",
        fontSize: "16px",
        fontWeight: "bold",
      }}
    >
      {nome}
    </button>
  );
}
