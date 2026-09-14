import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockPosts } from "../data/posts";
import PostBox from "../components/PostBox";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from backend API
  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        // Fallback to mock posts if API is not available
        setPosts(mockPosts);
        setLoading(false);
      });
  }, []);

  const handlePostCreate = (newPost) => {
    // Refresh posts from API after creation
    fetch('http://localhost:5000/api/posts')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error refreshing posts:", error);
      });
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading posts...</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <PostBox onPostCreate={handlePostCreate} />
      
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Recent Posts</h2>
        {[...posts].reverse().map((post) => (
          <div key={post.id} style={{ borderBottom: "1px solid #ccc", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
            <h2>{post.title}</h2>
            <small style={{ color: "gray" }}>{post.date}</small>
            <p>{post.header1 || post.excerpt}</p>
            <Link to={`/post/${post.id}`}>Read More →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}