import "./index.css";
import { INote } from "./types";
import User from "./components/User";
import { useState } from "preact/hooks";
import TextEditor from "./components/Editor";

export function App() {
  const [note, setNote] = useState<INote>({
    title: "",
    body: "",
    createdAt: "",
    user: { name: "", photoUrl: "" },
  });

  if (typeof window !== "undefined") {
    window.onmessage = (event) => {
      const { type, payload } = event.data.pluginMessage;

      if (type === "load-note") {
        setNote(payload);
      }
    };
  }

  const saveToBackend = (payload: { title?: string; body?: string }) => {
    window.parent.postMessage(
      { pluginMessage: { type: "save-note", payload } },
      "*",
    );
  };

  const handleChange = (name: string, value: string) => {
    setNote((prev) => {
      const newNote = { ...prev, [name]: value };
      saveToBackend(newNote);
      return newNote;
    });
  };

  return (
    <div
      className={
        "h-full p-4 flex flex-col justify-between text-sm text-gray-700"
      }
    >
      <div class="w-full">
        <input
          class="bg-none bg-transparent w-full text-lg font-semibold focus:outline-none placeholder-gray-300 resize-none min-h-[20px] "
          placeholder="Title of this Note"
          value={note.title}
          onChange={(e: Event) => {
            handleChange("title", (e.target as HTMLInputElement).value);
          }}
        />
        <TextEditor body={note.body} onChange={handleChange} />
      </div>

      <User userName={note.user.name} createdAt={note.createdAt} />
    </div>
  );
}
