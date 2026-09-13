import { useParams, Link } from "react-router-dom";
import { mockPosts } from "../data/posts";

export default function PostDetail() {
  const { id } = useParams();
  const post = mockPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return <div style={{ padding: "2rem" }}><h2>Post not found!</h2><Link to="/">Back Home</Link></div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link to="/">← Back to Home</Link>
      <h1 style={{ marginTop: "1rem" }}>{post.title}</h1>
      <p style={{ color: "gray" }}><small>{post.date}</small></p>
      <p style={{ lineHeight: "1.6", fontSize: "1.1rem" }}>{post.content}</p>
    </div>
  );
}