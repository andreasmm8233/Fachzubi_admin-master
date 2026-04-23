"use client";
import dynamic from "next/dynamic";
import React from "react";
import "react-quill/dist/quill.snow.css";
// Use dynamic to load ReactQuill only on the client side
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
    ["link"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

export interface TextEditorType {
  setContent: (data: string) => void;
  content: string;
  disabled?: boolean;
}

const TextEditor = ({ setContent, content, disabled }: TextEditorType) => {
  return (
    <div style={{ pointerEvents: disabled ? "none" : "auto" }}>
      <ReactQuill
        value={content}
        modules={modules}
        formats={formats}
        onChange={(txt) => setContent(txt)}
      />
    </div>
  );
};

export default TextEditor;
