import { useState } from "react";
import { parseFormattedText } from "../utils/formatParser";
import "../styles/FormattedTextarea.css";

export default function FormattedTextarea({ value, onChange, id, placeholder }) {
  const handleTextChange = (e) => {
    onChange(e);
  };

  return (
    <div className="formatted-textarea-container">
      <textarea
        id={id}
        className="formatted-textarea-input"
        value={value}
        onChange={handleTextChange}
        placeholder={placeholder}
      />
    </div>
  );
}
