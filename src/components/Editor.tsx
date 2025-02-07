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
            [
              { bold: true },
              { underline: true },
              { italic: true },
              { strike: true },
              { list: "ordered" },
              { color: [] },
              { background: [] },
              "link",
            ],
          ],
        },
      });

      quill.clipboard.dangerouslyPasteHTML(0, newBody);

      quill.clipboard.addMatcher(Node.ELEMENT_NODE, (_node, delta) => {
        delta.ops = delta.ops.map((op) => {
          if (op.attributes) {
            // Remove inline color styles
            delete op.attributes.color;
            // Remove background styles
            delete op.attributes.background;
            // Remove bold if coming from the copied text
            delete op.attributes.bold;
            // Remove italic if copied
            delete op.attributes.italic;
            // Remove underline if copied
            delete op.attributes.underline;
          }
          return op;
        });
        return delta;
      });

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
      className="w-full focus:outline-none !border-0 text-[#868C98] placeholder:text-[#CDD0D5]"
    />
  );
};

export default TextEditor;
