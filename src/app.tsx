import "./index.css";
import User from "./components/User";
import { useState } from "preact/hooks";
import TextEditor from "./components/Editor";

export function App() {
  const [initialUser, setInitialUser] = useState<string>("");
  const [note, setNote] = useState({ title: "", body: "", userName: "" });

  if (typeof window !== "undefined") {
    window.onmessage = (event) => {
      console.log(event.data.pluginMessage);
      const { type, payload } = event.data.pluginMessage;

      if (type === "set-user-info") {
        setInitialUser(payload);
      }

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
      if (!newNote.userName) {
        newNote.userName = initialUser;
      }
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
          class="w-full text-xl font-bold focus:outline-none placeholder-gray-300 resize-none min-h-[20px] text-gray-700"
          placeholder="Title of this Note"
          value={note.title}
          onChange={(e: Event) => {
            handleChange("title", (e.target as HTMLInputElement).value);
          }}
        />
        <TextEditor body={note.body} onChange={handleChange} />
      </div>

      <User userName={note.userName || initialUser} />
    </div>
  );
}
