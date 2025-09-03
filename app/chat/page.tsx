export default function Chat() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Chat (Platzhalter)</h1>
      <p className="mt-2">Hier wird später der Sachverhalts-Chat mit KI-Rückfragen stehen.</p>
      <form className="mt-4">
        <textarea
          className="w-full h-40 border p-2 rounded"
          placeholder="Sachverhalt hier eingeben..."
        />
        <button
          type="button"
          className="mt-2 px-4 py-2 rounded bg-black text-white"
        >
          Senden
        </button>
      </form>
    </main>
  );
}
