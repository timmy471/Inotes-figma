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
        "h-full flex flex-col justify-between text-sm text-[#CDD0D5] relative"
      }
    >
      <div class="w-full p-4 ">
        <input
          class="bg-none bg-transparent w-full text-xl text-[#0A0D14] focus:outline-none placeholder-[#CDD0D5] resize-none min-h-[20px] "
          placeholder="Title of this Note"
          value={note.title}
          onChange={(e: any) => {
            handleChange("title", (e.target as HTMLInputElement).value);
          }}
        />
        <TextEditor body={note.body} onChange={handleChange} />
      </div>
      <div className="sticky bottom-0 bg-white py-1.5 px-4 user">
        <User userName={note.user.name} createdAt={note.createdAt} />
      </div>
    </div>
  );
}
