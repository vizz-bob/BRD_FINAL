import { useState } from "react";

export default function CaseNotes({ notes, setNotes }) {
  const [text, setText] = useState("");

  const addNote = () => {
    if (!text.trim()) return;

    const newNote = {
      id: notes.length + 1,
      text,
      ts: new Date().toLocaleString(),
    };

    setNotes((prev) => [...prev, newNote]);
    setText("");
  };

  return (
    <div className="bg-white p-4 shadow rounded-xl mt-6">
      <h2 className="text-lg font-bold mb-4">Case Notes</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a note for this case…"
        className="w-full p-3 border rounded-lg mb-3"
        rows={3}
      />

      <button
        onClick={addNote}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Add Note
      </button>

      <div className="mt-4 space-y-3">
        {[...notes].reverse().map((note) => (
          <div key={note.id} className="border rounded-lg p-3 bg-gray-50">
            <p className="text-sm">{note.text}</p>
            <p className="text-xs text-gray-500 mt-1">{note.ts}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
