"use client";
import { useEffect, useState } from "react";

type Msg = { id: string; created_at: string; text: string; sender: string };

export default function Chat() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<null | "sending" | "ok" | "error">(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  async function loadMessages() {
    const res = await fetch("/api/messages", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setMessages(data.messages ?? []);
  }

  useEffect(() => {
    loadMessages();
  }, []);

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
      loadMessages(); // Liste aktualisieren
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e?.message ?? "Netzwerkfehler");
    }
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Chat (Platzhalter)</h1>
      <p className="mt-2">Sachverhalt eingeben – Einträge werden gespeichert und unten angezeigt.</p>

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

      {status === "ok" && <p className="mt-2 text-green-500">Gespeichert!</p>}
      {status === "error" && <p className="mt-2 text-red-500">Fehler: {errorMsg}</p>}

      <h2 className="text-xl font-semibold mt-8 mb-3">Letzte Nachrichten</h2>
      <ul className="space-y-3">
        {messages.map((m) => (
          <li key={m.id} className="border rounded p-3">
            <div className="text-sm opacity-60">
              {new Date(m.created_at).toLocaleString()}
            </div>
            <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
          </li>
        ))}
        {messages.length === 0 && <li className="opacity-60">Noch keine Nachrichten.</li>}
      </ul>
    </main>
  );
}

