import { Link, Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <div>
      <header style={{ padding: "1rem" }}>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/">Home</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/projetos">Projetos</Link>
          <Link to="/contato">Contato</Link>
        </nav>
      </header>

      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>

      <footer style={{ padding: "1rem", textAlign: "center" }}>
        <p>© {new Date().getFullYear()} Felipe Souto</p>
      </footer>
    </div>
  );
}
