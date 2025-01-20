import Quill from "quill";
import "quill/dist/quill.bubble.css";
import { useEffect, useRef } from "preact/hooks";

const TextEditor = ({ note, onChange }: { note: string; onChange: any }) => {
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

      // quill.setText(note);
      console.log(note);
      // quill.clipboard.dangerouslyPasteHTML(0, note, 'api');
      quill.clipboard.dangerouslyPasteHTML(0, note, "api");

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
  }, []);

  return (
    <div
      ref={editorRef}
      id="editor"
      // dangerouslySetInnerHTML={note ? (note as any) : undefined}
      className="w-full focus:outline-none !placeholder-gray-400 !border-0 text-gray-500"
    />
  );
};

export default TextEditor;
