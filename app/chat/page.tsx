"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { id: string; created_at: string; text: string; sender: string };

export default function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  async function loadMessages() {
    try {
      setLoading(true);
      const res = await fetch("/api/messages", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Fehler beim Laden");
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
    taRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = text.trim();
    if (!payload) {
      setError("Bitte gib einen Text ein.");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: payload }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Fehler beim Senden");

      setText("");
      await loadMessages();
      taRef.current?.focus();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(e);
      setError(msg);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      (e.currentTarget.form as HTMLFormElement | null)?.requestSubmit();
    }
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Chat (Platzhalter)</h1>
      <p className="mt-2">Sachverhalt eingeben – Nachrichten werden gespeichert und unten angezeigt.</p>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          ref={taRef}
          className="w-full h-40 border p-2 rounded"
          placeholder="Sachverhalt hier eingeben..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            disabled={sending}
          >
            {sending ? "Senden..." : "Senden"}
          </button>
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-3">Letzte Nachrichten</h2>

      {loading ? (
        <p className="opacity-60">Lade…</p>
      ) : messages.length === 0 ? (
        <p className="opacity-60">Noch keine Nachrichten.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className="border rounded p-3">
              <div className="text-sm opacity-60">
                {new Date(m.created_at).toLocaleString()}
              </div>
              <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
