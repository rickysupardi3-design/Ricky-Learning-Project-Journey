import { Link } from "react-router-dom";
import { mockPosts } from "../data/posts";

export default function Home() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {mockPosts.map((post) => (
        <div key={post.id} style={{ borderBottom: "1px solid #ccc", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
          <h2>{post.title}</h2>
          <small style={{ color: "gray" }}>{post.date}</small>
          <p>{post.excerpt}</p>
          <Link to={`/post/${post.id}`}>Read More →</Link>
        </div>
      ))}
    </div>
  );
}