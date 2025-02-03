import Quill from "quill";
import "quill/dist/quill.bubble.css";
import { useState } from "preact/hooks";
import { useEffect, useRef } from "preact/hooks";

const TextEditor = ({ body, onChange }: { body: string; onChange: any }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [newBody, setNewBody] = useState<string>(body);

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        placeholder: "What's on you mind?",
        theme: "bubble",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }],
            [{ list: "ordered" }],
            [{ bold: true }, { underline: true }],
          ],
        },
      });

      quill.clipboard.dangerouslyPasteHTML(0, newBody);

      quill.on("text-change", () => {
        const editorVal = editorRef?.current?.children[0].innerHTML;
        onChange("body", editorVal);
      });

      return () => {
        quill.off("text-change");
        if ("destroy" in quill) {
          (quill as any).destroy();
        }
      };
    }
  }, [newBody]);

  useEffect(() => {
    if (!newBody) setNewBody(body);
  }, [body]);

  return (
    <div
      ref={editorRef}
      id="editor"
      className="w-full focus:outline-none !border-0 text-gray-500"
    />
  );
};

export default TextEditor;
