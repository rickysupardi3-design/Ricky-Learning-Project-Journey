import { useParams, Link, useNavigate } from "react-router-dom";
import { mockPosts } from "../data/posts";
import { FormattedText } from "../utils/formatParser";
import { useState } from "react";
import "../styles/PostBox.css";
import FormattedTextarea from "../components/FormattedTextarea";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState({});
  
  // Try to find post from localStorage first, then from mockPosts
  const getSavedPosts = () => {
    const saved = localStorage.getItem("blogPosts");
    return saved ? JSON.parse(saved) : mockPosts;
  };
  
  const allPosts = getSavedPosts();
  const post = allPosts.find((p) => p.id === parseInt(id) || p.id === parseInt(id) || p.id === id);

  if (!post) {
    return <div style={{ padding: "2rem" }}><h2>Post not found!</h2><Link to="/">Back Home</Link></div>;
  }

  // Initialize edit form when edit button is clicked
  const handleEditClick = () => {
    setEditTitle(post.title);
    setEditContent(post.content || "");
    setEditImages(post.images || {});
    setIsEditing(true);
  };

  // Handle image upload in edit mode - store with filename
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const filename = file.name.replace(/\s+/g, '_');
        reader.onloadend = () => {
          setEditImages((prevImages) => ({
            ...prevImages,
            [filename]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Insert image reference into content
  const insertImageReference = (filename) => {
    const imageMarkdown = `![image](${filename})`;
    setEditContent((prevContent) => prevContent + imageMarkdown + "\n");
  };

  // Remove image from storage
  const removeImage = (filename) => {
    setEditImages((prevImages) => {
      const updated = { ...prevImages };
      delete updated[filename];
      return updated;
    });
  };

  // Save edited post
  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!editContent.trim()) {
      alert("Please enter content");
      return;
    }

    // Update post in localStorage
    const saved = localStorage.getItem("blogPosts");
    let posts = saved ? JSON.parse(saved) : mockPosts;
    
    posts = posts.map(p => 
      p.id === post.id 
        ? {
            ...p,
            title: editTitle.trim(),
            content: editContent.trim(),
            images: editImages,
            excerpt: editContent.substring(0, 150) + "..."
          }
        : p
    );

    localStorage.setItem("blogPosts", JSON.stringify(posts));
    setIsEditing(false);
    // Refresh page to show updated content
    window.location.reload();
  };

  // Handle text formatting - apply to selected text
  const applyFormat = (format) => {
    const textarea = document.getElementById("editPostContent");
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editContent.substring(start, end);

    if (!selectedText) {
      alert("Please select text first");
      return;
    }

    let formattedText = selectedText;
    
    if (format === "bold") {
      formattedText = `**${selectedText}**`;
    } else if (format === "italic") {
      formattedText = `*${selectedText}*`;
    } else if (format === "underline") {
      formattedText = `__${selectedText}__`;
    }

    const newContent = editContent.substring(0, start) + formattedText + editContent.substring(end);
    setEditContent(newContent);
  };

  // Handle hyperlink
  const addHyperlink = () => {
    const textarea = document.getElementById("editPostContent");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editContent.substring(start, end);

    if (!selectedText) {
      alert("Please select text to add a hyperlink");
      return;
    }

    const url = prompt("Enter URL:", "https://");
    if (url) {
      const linkedText = `[${selectedText}](${url})`;
      const newContent = editContent.substring(0, start) + linkedText + editContent.substring(end);
      setEditContent(newContent);
    }
  };

   // Cancel editing
   const handleCancelEdit = () => {
     setIsEditing(false);
   };

  // Delete post
  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      const saved = localStorage.getItem("blogPosts");
      let posts = saved ? JSON.parse(saved) : mockPosts;
      
      posts = posts.filter(p => p.id !== post.id);
      localStorage.setItem("blogPosts", JSON.stringify(posts));
      
      alert("Post deleted successfully!");
      navigate("/");
    }
  };

  return ( 
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {!isEditing ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <Link to="/">← Back to Home</Link>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                onClick={handleEditClick}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                Edit
              </button>
              <button 
                onClick={handleDeletePost}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                Delete
              </button>
            </div>
          </div>

          <h1 style={{ marginTop: "1rem" }}>{post.title}</h1>
          <p style={{ color: "gray" }}><small>{post.date}</small></p>
          
          {/* Display multiple images if available */}
          {post.images && post.images.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              {post.images.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`${post.title} ${index + 1}`} 
                  style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px", margin: "1rem 0" }}
                />
              ))}
            </div>
          )}

          {/* Display single image if available (backward compatibility) */}
          {!post.images && post.image && (
            <img 
              src={post.image} 
              alt={post.title} 
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px", margin: "1rem 0" }}
            />
          )}

           {/* Display new-style posts with formatting */}
           {post.content && (
             <div style={{ lineHeight: "1.8", fontSize: "1.1rem", marginTop: "1.5rem", whiteSpace: "pre-wrap" }}>
               <FormattedText text={post.content} images={post.images || {}} />
             </div>
           )}

          {/* Display old-style posts for backward compatibility */}
          {!post.content && (
            <>
              <p style={{ lineHeight: "1.6", fontSize: "1.1rem" , fontWeight : "bold" }}>{post.header1}</p>
              <p style={{ lineHeight: "1.6", fontSize: "1.1rem" }}><span style={{ fontWeight: "bold" , textDecoration: "underline" }}>{post.problem1}</span>{post.problem1_2}</p>
              <p style={{ lineHeight: "1.6", fontSize: "1.1rem" }}>{post.context1}<span> <a href={post.url1} target="_blank" rel="noopener noreferrer">{post.url1}</a></span></p>
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.title} 
                  style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px", margin: "1rem 0" }}
                />
              )}
              <p style={{ lineHeight: "1.6", fontSize: "1.1rem" }}>{post.body1}</p>
              <p style={{ lineHeight: "1.6", fontSize: "1.1rem" , textDecoration: "underline" }}>{post.conclusion1}</p>
              {post.image2&& (
                <img 
                  src={post.image2} 
                  alt={post.title} 
                  style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px", margin: "1rem 0" }}
                ></img>
              )}
              <p style={{ lineHeight: "1.6", fontSize: "1.1rem" }}>{post.body2}</p>
              <p style={{ lineHeight: "1.6", fontSize: "1.1rem" }}><span>{post.front_body2}</span><span style={{ textDecoration: "underline" }}>{post.underline1}</span>{post.body2_1}</p>
              <p style={{ lineHeight: "1.6", fontSize: "1.1rem" }}><span>{post.front_body2}</span><span style={{ textDecoration: "underline" }}>{post.underline2}</span>{post.body2_2}</p>
              <p style={{ lineHeight: "1.6", fontSize: "1.1rem" , textDecoration: "underline", fontWeight: "bold" }}>{post.conclusion2}</p>
            </>
          )}
        </>
      ) : (
        // Edit Mode
        <div>
          <h2>Edit Post</h2>
          
           {/* Edit Title */}
           <input
             type="text"
             placeholder="Post Title"
             value={editTitle}
             onChange={(e) => setEditTitle(e.target.value)}
             style={{
               width: "100%",
               padding: "0.75rem",
               marginBottom: "1rem",
               border: "1px solid #ccc",
               borderRadius: "4px",
               fontSize: "1rem",
               fontFamily: "inherit",
               boxSizing: "border-box"
             }}
            />

            {/* Formatting Toolbar */}
            <div className="toolbar" style={{ marginBottom: "1rem" }}>
              <button
                className="toolbar-btn"
                onClick={() => applyFormat("bold")}
                title="Bold - Select text first"
              >
                <strong>B</strong>
              </button>
              <button
                className="toolbar-btn"
                onClick={() => applyFormat("italic")}
                title="Italic - Select text first"
              >
                <i>I</i>
              </button>
              <button
                className="toolbar-btn"
                onClick={() => applyFormat("underline")}
                title="Underline - Select text first"
              >
                <u>U</u>
              </button>
              <div className="toolbar-divider"></div>
              <button
                className="toolbar-btn"
                onClick={addHyperlink}
                title="Add Link"
              >
                🔗
              </button>
              <div className="toolbar-divider"></div>
               <label className="toolbar-btn file-upload">
                 🖼️
                 <input
                   type="file"
                   accept="image/*"
                   onChange={handleImageUpload}
                   multiple
                   hidden
                 />
               </label>
            </div>

            {/* Image Gallery */}
           {Object.keys(editImages).length > 0 && (
             <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
               <h4>Uploaded Images - Click to insert into content:</h4>
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.5rem" }}>
                 {Object.entries(editImages).map(([filename, imageData]) => (
                   <div key={filename} style={{ position: "relative" }}>
                     <img
                       src={imageData}
                       alt={filename}
                       onClick={() => insertImageReference(filename)}
                       style={{
                         width: "100%",
                         height: "100px",
                         objectFit: "cover",
                         borderRadius: "4px",
                         cursor: "pointer",
                         border: "2px solid transparent",
                         transition: "border 0.2s"
                       }}
                       onMouseOver={(e) => e.target.style.border = "2px solid #007bff"}
                       onMouseOut={(e) => e.target.style.border = "2px solid transparent"}
                       title="Click to insert"
                     />
                     <button
                       onClick={() => removeImage(filename)}
                       style={{
                         position: "absolute",
                         top: "2px",
                         right: "2px",
                         background: "rgba(220, 53, 69, 0.8)",
                         color: "white",
                         border: "none",
                         borderRadius: "50%",
                         width: "20px",
                         height: "20px",
                         padding: "0",
                         cursor: "pointer",
                         fontSize: "12px",
                         lineHeight: "1"
                       }}
                     >
                       ✕
                     </button>
                     <div style={{ fontSize: "0.7rem", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                       {filename}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

            {/* Edit Content */}
            <FormattedTextarea
              id="editPostContent"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Post content with formatting: **bold** *italic* __underline__ [text](url)"
            />

          {/* Edit Buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <button
              onClick={handleCancelEdit}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#e9ecef",
                color: "#495057",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600"
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600"
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}