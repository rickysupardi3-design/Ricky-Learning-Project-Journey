import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockPosts } from "../data/posts";
import PostBox from "../components/PostBox";

export default function Home() {
  const [posts, setPosts] = useState(() => {
    // Load posts from localStorage on initial load
    const savedPosts = localStorage.getItem("blogPosts");
    return savedPosts ? JSON.parse(savedPosts) : mockPosts;
  });

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
  }, [posts]);

  const handlePostCreate = (newPost) => {
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    alert("Post created successfully!");
  };

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