import Quill from "quill";
import "quill/dist/quill.bubble.css";
import { useState } from "preact/hooks";
import { useEffect, useRef } from "preact/hooks";

const TextEditor = ({ note, onChange }: { note: string; onChange: any }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [newNote, setNewNote] = useState<string>(note);

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        placeholder: "Enter Note here...",
        theme: "bubble",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }],
            [{ list: "ordered" }],
            [{ bold: true }, { underline: true }],
          ],
        },
      });

      quill.clipboard.dangerouslyPasteHTML(0, newNote);

      quill.on("text-change", () => {
        const editorVal = editorRef?.current?.children[0].innerHTML;
        onChange("note", editorVal);
      });

      return () => {
        quill.off("text-change");
        if ("destroy" in quill) {
          (quill as any).destroy();
        }
      };
    }
  }, [newNote]);

  useEffect(() => {
    if (!newNote) setNewNote(note);
  }, [note]);

  return (
    <div
      ref={editorRef}
      id="editor"
      className="w-full focus:outline-none !placeholder-gray-400 !border-0 text-gray-500"
    />
  );
};

export default TextEditor;
