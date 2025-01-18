import Quill from "quill";
import "quill/dist/quill.bubble.css";
import { useEffect, useRef } from "preact/hooks";

const TextEditor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);

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

      return () => {
        if ("destroy" in quill) {
          (quill as any).destroy();
        }
      };
    }
  }, []);

  return (
    <div
      ref={editorRef}
      id="editor"
      className="w-full focus:outline-none !placeholder-gray-400 !h-[100px] !border-0 text-gray-500"
    />
  );
};

export default TextEditor;
