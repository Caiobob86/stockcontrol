export default function EntradaPage() {
  return (
    <main
      style={{
        maxWidth: "1400px",
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

      <h1 style={{ fontSize: "56px", marginTop: "8px" }}>
        Entrada de Materiais
      </h1>

      <p style={{ color: "#64748b", marginBottom: "32px" }}>
        Registre todas as entradas de materiais do estoque.
      </p>

      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          padding: "30px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2>Em desenvolvimento</h2>

        <p>
          Nesta tela serão registrados:
        </p>

        <ul>
          <li>Material</li>
          <li>Local de estoque</li>
          <li>Quantidade</li>
          <li>Responsável</li>
          <li>Observação</li>
          <li>Data e hora</li>
        </ul>
      </div>
    </main>
  );
}
