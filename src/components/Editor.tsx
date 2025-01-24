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
        placeholder: "Add a subtitle to this note",
        theme: "bubble",
        modules: {
          toolbar: [
            [
              { bold: true },
              { underline: true },
              { italic: true },
              { strike: true },
            ],
            [{ list: "ordered" }],
            [{ color: [] }, { background: [] }],
            ["link"],
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
      className="w-full focus:outline-none !placeholder-[#CDD0D5] !border-0 text-[#525866] -tracking-[0.02]"
    />
  );
};

export default TextEditor;
