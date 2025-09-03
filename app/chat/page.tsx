"use client";
import { useState } from "react";

export default function Chat() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<null | "sending" | "ok" | "error">(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSend() {
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error ?? "Fehler beim Senden");
        return;
      }
      setStatus("ok");
      setText("");
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message ?? "Netzwerkfehler");
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Chat (Platzhalter)</h1>
      <p className="mt-2">Hier wird später der Sachverhalts-Chat mit KI-Rückfragen stehen.</p>

      <textarea
        className="w-full h-40 border p-2 rounded mt-4"
        placeholder="Sachverhalt hier eingeben..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={status === "sending" || !text.trim()}
        className="mt-2 px-4 py-2 rounded bg-black text-white disabled:opacity-60"
      >
        {status === "sending" ? "Senden..." : "Senden"}
      </button>

      {status === "ok" && (
        <p className="mt-2 text-green-500">Gespeichert! Danke für deine Nachricht.</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-red-500">Fehler: {errorMsg}</p>
      )}
    </main>
  );
}

