export default function EntradaPage() {
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
        Entrada de Materiais
      </h1>

      <p style={{ color: "#666", marginBottom: "30px" }}>
        Primeira versão do módulo de entrada.
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "24px",
          background: "#fafafa",
        }}
      >
        <h2>Em desenvolvimento 🚧</h2>

        <p>Em breve esta tela permitirá registrar:</p>

        <ul>
          <li>Material</li>
          <li>Quantidade</li>
          <li>Local do estoque</li>
          <li>Responsável</li>
          <li>Observação</li>
          <li>Data e hora</li>
        </ul>
      </div>
    </main>
  );
}
