import "./index.css";
import User from "./components/User";
import { useState } from "preact/hooks";
import TextEditor from "./components/Editor";

export function App() {
  const [initialUser, setInitialUser] = useState<string>("");
  const [info, setInfo] = useState({ title: "", note: "", userName: "" });

  if (typeof window !== "undefined") {
    window.onmessage = (event) => {
      const { type, body } = event.data.pluginMessage;

      if (type === "set-user-info") {
        setInitialUser(body);
      }

      if (type === "load-note") {
        setInfo(body);
      }
    };
  }

  const saveToBackend = (payload: { title?: string; note?: string }) => {
    window.parent.postMessage(
      { pluginMessage: { type: "save-note", payload } },
      "*",
    );
  };

  const handleChange = (name: string, value: string) => {
    setInfo((prev) => {
      const newInfo = { ...prev, [name]: value };
      if (!newInfo.userName) {
        newInfo.userName = initialUser;
      }
      saveToBackend(newInfo);
      return newInfo;
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
          value={info.title}
          onChange={(e: Event) => {
            handleChange("title", (e.target as HTMLInputElement).value);
          }}
        />
        <TextEditor note={info.note} onChange={handleChange} />
      </div>

      <User userName={info.userName || initialUser} />
    </div>
  );
}
