"use client";
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { header: "3" }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline", "strike"],
            ["link"],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
          ],
        },
        formats: [
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "indent",
          "link",
          "image",
          "video",
          "color",
          "align",
          "background",
        ],
      });

      // Sync change events
      quillRef.current.on("text-change", () => {
        const html =
          editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
        onChange(html);
      });
    }

    // Set initial value when component mounts or value changes externally
    if (value && quillRef.current) {
      const editor = quillRef.current.root;
      if (editor.innerHTML !== value) {
        editor.innerHTML = value;
      }
    }
  }, [value, onChange]);

  return (
    <div
      ref={editorRef}
      className="bg-white rounded-lg border-1 border-zinc-200 p-3 min-h-48"
    />
  );
};
