// NotesSection.jsx
import React, { useState, useEffect } from 'react';
import { Plus, FileText, Trash2, Edit, Save, X } from 'lucide-react';

const NotesSection = ({ entityId, entityType }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Mock data - replace with API call
    const mockNotes = [
      {
        id: 'NOTE-001',
        text: 'Customer is interested in home loan. Currently renting and looking to buy property in next 6 months. Salary: 8L/year. CIBIL Score: 750.',
        createdBy: 'Agent A',
        createdAt: '2025-01-27T10:30:00',
        updatedAt: '2025-01-27T10:30:00'
      },
      {
        id: 'NOTE-002',
        text: 'Follow-up scheduled for next Monday to discuss property options and loan eligibility.',
        createdBy: 'Agent A',
        createdAt: '2025-01-26T15:20:00',
        updatedAt: '2025-01-26T15:20:00'
      },
      {
        id: 'NOTE-003',
        text: 'Customer mentioned preference for 20-year tenure with minimal down payment.',
        createdBy: 'Agent B',
        createdAt: '2025-01-25T09:15:00',
        updatedAt: '2025-01-25T09:15:00'
      }
    ];
    setNotes(mockNotes);
  }, [entityId]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note = {
      id: `NOTE-${String(notes.length + 1).padStart(3, '0')}`,
      text: newNote,
      createdBy: 'Current User', // Replace with actual user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes([note, ...notes]);
    setNewNote('');
    setShowAddForm(false);
  };

  const handleEditNote = (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setEditingText(note.text);
    }
  };

  const handleSaveEdit = () => {
    setNotes(notes.map(note =>
      note.id === editingNoteId
        ? { ...note, text: editingText, updatedAt: new Date().toISOString() }
        : note
    ));
    setEditingNoteId(null);
    setEditingText('');
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingText('');
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Add Note Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>Add Note</span>
        </button>
      )}

      {/* Add Note Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type your note here..."
            rows="4"
            className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>Save Note</span>
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewNote('');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No notes yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first note to get started</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              {editingNoteId === note.id ? (
                <div>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-900 mb-3 whitespace-pre-wrap">
                    {note.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">{note.createdBy}</span>
                      {' • '}
                      {formatTimestamp(note.createdAt)}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditNote(note.id)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesSection;