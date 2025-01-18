import "./index.css";
import User from "./components/User";
import { useState } from "preact/hooks";
import TextEditor from "./components/Editor";

export function App() {
  const [userName, setUserName] = useState<string>("");

  if (typeof window !== "undefined") {
    window.onmessage = (event) => {
      const { type, userName } = event.data.pluginMessage;

      if (type === "set-user-info") {
        setUserName(userName);
      }
    };
  }

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
        />
        <TextEditor />
      </div>

      <User userName={userName} />
    </div>
  );
}
