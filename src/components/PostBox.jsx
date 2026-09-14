import { useState } from "react";
import "../styles/PostBox.css";
import FormattedTextarea from "./FormattedTextarea";

export default function PostBox({ onPostCreate }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [images, setImages] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_WORDS = 10000;
  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Handle text formatting - apply to selected text
  const applyFormat = (format) => {
    const textarea = document.getElementById("postContent");
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

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

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  // Handle hyperlink
  const addHyperlink = () => {
    const textarea = document.getElementById("postContent");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (!selectedText) {
      alert("Please select text to add a hyperlink");
      return;
    }

    const url = prompt("Enter URL:", "https://");
    if (url) {
      const linkedText = `[${selectedText}](${url})`;
      const newContent = content.substring(0, start) + linkedText + content.substring(end);
      setContent(newContent);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const filename = file.name.replace(/\s+/g, '_');
        reader.onloadend = () => {
          setImages((prevImages) => ({
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
    setContent((prevContent) => prevContent + imageMarkdown + "\n");
  };

  // Remove image from storage
  const removeImage = (filename) => {
    setImages((prevImages) => {
      const updated = { ...prevImages };
      delete updated[filename];
      return updated;
    });
  };

  // Handle post creation
  const handleCreatePost = () => {
    if (!title.trim()) {
      alert("Please enter a title for your post");
      return;
    }

    if (!summary.trim()) {
      alert("Please enter 'What is your goal for this?'");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content for your post");
      return;
    }

    if (wordCount > MAX_WORDS) {
      alert(`Post exceeds maximum word limit of ${MAX_WORDS} words`);
      return;
    }

    const newPost = {
      id: Date.now(),
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      images: images,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      excerpt: summary.trim(),
    };

    onPostCreate(newPost);

    // Reset form
    setTitle("");
    setSummary("");
    setContent("");
    setImages({});
    setIsExpanded(false);
  };

  // Handle cancel
  const handleCancel = () => {
    setTitle("");
    setSummary("");
    setContent("");
    setImages({});
    setIsExpanded(false);
  };

  return (
    <div className="post-box-container">
      <div className="post-box">
        {!isExpanded ? (
          <div
            className="post-box-input"
            onClick={() => setIsExpanded(true)}
            placeholder="What you learned today?"
          >
            <div className="post-box-avatar">👤</div>
            <input
              type="text"
              placeholder="What you learned today?"
              readOnly
              style={{ cursor: "pointer" }}
            />
          </div>
        ) : (
          <div className="post-box-expanded">
            <div className="post-box-header">
              <h3>Create New Post</h3>
              <button
                className="close-btn"
                onClick={handleCancel}
              >
                ✕
              </button>
            </div>

            {/* Title Input */}
            <input
              type="text"
              className="post-title-input"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* What is your goal today Input */}
             <textarea
               className="post-summary-input"
               placeholder="What is your goal for this project?"
               value={summary}
               onChange={(e) => setSummary(e.target.value)}
               maxLength={500}
               style={{
                 width: "100%",
                 minHeight: "80px",
                 padding: "0.75rem",
                 border: "1px solid #dee2e6",
                 borderRadius: "4px",
                 fontSize: "0.95rem",
                 fontFamily: "inherit",
                 marginBottom: "1rem",
                 resize: "vertical",
                 outline: "none"
               }}
              />

              {/* Formatting Toolbar */}
              <div className="toolbar">
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
             {Object.keys(images).length > 0 && (
               <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                 <h4>Uploaded Images - Click to insert into content:</h4>
                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.5rem" }}>
                   {Object.entries(images).map(([filename, imageData]) => (
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

              {/* Content Textarea */}
              <FormattedTextarea
                id="postContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share what you learned today..."
              />

            {/* Word Count */}
            <div className="word-count">
              <span>{wordCount} / {MAX_WORDS} words</span>
              {wordCount > MAX_WORDS * 0.9 && (
                <span style={{ color: "#ff6b6b", marginLeft: "1rem" }}>
                  ⚠️ Approaching word limit
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="post-box-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="btn-post"
                onClick={handleCreatePost}
                disabled={!title.trim() || !content.trim() || wordCount > MAX_WORDS}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
