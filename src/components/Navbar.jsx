import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        padding: "1rem",
        background: "#333",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0 }}>Learning Journey Blog Ricky</h2>
      <div style={{ marginTop: "0.5rem", display: "flex", gap: "2rem" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none"}}>Home</Link>
      </div>
    </nav>
  );
}