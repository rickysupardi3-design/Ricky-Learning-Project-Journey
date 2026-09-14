// Utility function to parse and render formatted text
// Supports: **bold** *italic* __underline__ [text](url) ![alt](image)

export const parseFormattedText = (text) => {
  if (!text) return [];

  const parts = [];

  // Regular expression to match all formatting patterns in order of priority
  // IMPORTANT: Bold (**) must be matched before italic (*) to avoid conflicts
  const patterns = [
    { regex: /!\[([^\]]*)\]\(([^)]+)\)/g, type: "image" },
    { regex: /\*\*\*(.+?)\*\*\*/g, type: "bolditalic" },
    { regex: /\*\*(.+?)\*\*/g, type: "bold" },
    { regex: /__(.+?)__/g, type: "underline" },
    { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: "link" },
    { regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, type: "italic" },
  ];

  // Create a map of all matches with their positions
  const matches = [];

  patterns.forEach((pattern) => {
    let match;
    const regex = new RegExp(pattern.regex);
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        type: pattern.type,
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        url: match[2] || null,
        fullMatch: match[0],
      });
    }
  });

  // Sort matches by start position, then by length (longer first to handle nesting)
  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return (b.end - b.start) - (a.end - a.start);
  });

  // Remove overlapping matches - keep the first match
  const filteredMatches = [];
  matches.forEach((match) => {
    const isOverlapping = filteredMatches.some(
      (m) => (match.start >= m.start && match.start < m.end) || 
              (match.end > m.start && match.end <= m.end) ||
              (m.start >= match.start && m.start < match.end)
    );
    if (!isOverlapping) {
      filteredMatches.push(match);
    }
  });

  // Process matches and build parts array
  let currentIndex = 0;
  filteredMatches.forEach((match) => {
    if (match.start > currentIndex) {
      parts.push({
        type: "text",
        content: text.substring(currentIndex, match.start),
      });
    }
    parts.push({
      type: match.type,
      content: match.content,
      url: match.url,
    });
    currentIndex = match.end;
  });

  if (currentIndex < text.length) {
    parts.push({
      type: "text",
      content: text.substring(currentIndex),
    });
  }

  return parts;
};

// React component to render formatted text
export const FormattedText = ({ text, images = {} }) => {
  const parts = parseFormattedText(text);

  return (
    <>
      {parts.map((part, index) => {
        switch (part.type) {
          case "bolditalic":
            return <strong key={index}><em>{part.content}</em></strong>;
          case "bold":
            return <strong key={index}>{part.content}</strong>;
          case "italic":
            return <em key={index}>{part.content}</em>;
          case "underline":
            return (
              <u key={index}>{part.content}</u>
            );
          case "link":
            return (
              <a
                key={index}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff", textDecoration: "underline" }}
              >
                {part.content}
              </a>
            );
          case "image":
            // Check if image reference is a filename or full URL
            const imageUrl = images[part.url] || part.url;
            return (
              <div key={index} style={{ margin: "1rem 0" }}>
                <img
                  src={imageUrl}
                  alt={part.content}
                  style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
                />
              </div>
            );
          default:
            return <span key={index}>{part.content}</span>;
        }
      })}
    </>
  );
};
