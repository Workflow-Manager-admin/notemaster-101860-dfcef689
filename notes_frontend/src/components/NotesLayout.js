import React, { useState, useEffect } from "react";
import NotesSidebar from "./NotesSidebar";
import NoteDetail from "./NoteDetail";
import "./NotesLayout.css";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote as apiDeleteNote,
  getNote
} from "../api";

/**
 * PUBLIC_INTERFACE
 * NotesLayout: Main layout for notes app, connected to backend API.
 * Loads notes from backend, allows CRUD, and connects NoteSidebar + NoteDetail.
 */
function NotesLayout() {
  // Local state for notes, selected note, loading, error, staged note edits
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stagedNote, setStagedNote] = useState(null); // For unsaved input (optional)

  // Fetch all notes from backend on mount
  useEffect(() => {
    setLoading(true);
    getNotes()
      .then(data => {
        setNotes(Array.isArray(data) ? data : []);
        if (data && data.length > 0) {
          setSelectedNoteId(data[0].id);
        } else {
          setSelectedNoteId(null);
        }
        setError("");
      })
      .catch(e => {
        setError("Failed to load notes: " + e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Find selected note by id
  const selectedNote = notes.find(n => n.id === selectedNoteId) || null;

  // Handler to select a note
  const handleSelectNote = noteId => {
    setSelectedNoteId(noteId);
    // Optionally fetch fresh note detail here. For now, use from array.
    setStagedNote(null); // Clear staged edits when selecting a new note
  };

  // Handler to add note: creates via API then selects it
  const handleAddNote = async () => {
    setLoading(true);
    try {
      const newNote = await createNote({
        title: "",
        body: ""
      });
      // Refetch list or append (assume backend returns new note with id)
      setNotes(old => [newNote, ...old]);
      setSelectedNoteId(newNote.id);
      setError("");
    } catch (e) {
      setError("Failed to add note: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler to update staged note input as user types
  const handleNoteChange = updated => {
    setStagedNote(updated);
  };

  // Handler to save current note (create or update)
  const handleSaveNote = async noteToSave => {
    setLoading(true);
    setError("");
    try {
      if (!noteToSave.id) {
        // Should not happen: always create via handleAddNote
        const created = await createNote({
          title: noteToSave.title,
          body: noteToSave.body
        });
        setNotes(old => [created, ...old]);
        setSelectedNoteId(created.id);
        setStagedNote(null);
      } else {
        // Update note in backend
        const updated = await updateNote(noteToSave.id, {
          title: noteToSave.title,
          body: noteToSave.body
        });
        // Update note in list
        setNotes(notes =>
          notes.map(n => (n.id === updated.id ? { ...n, ...updated } : n))
        );
        setStagedNote(null);
      }
    } catch (e) {
      setError("Failed to save note: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Handler to delete note (API + update local list)
  const handleDeleteNote = async noteId => {
    if (!noteId) return;
    setLoading(true);
    setError("");
    try {
      await apiDeleteNote(noteId);
      setNotes(notes => notes.filter(note => note.id !== noteId));
      // Auto-select next available note
      setTimeout(() => {
        const filtered = notes.filter(note => note.id !== noteId);
        setSelectedNoteId(filtered[0]?.id || null);
        setStagedNote(null);
      }, 0);
    } catch (e) {
      setError("Failed to delete note: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notes-layout">
      <NotesSidebar
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelectNote={handleSelectNote}
        onAddNote={handleAddNote}
      />
      <main className="notes-main">
        {loading && (
          <div style={{ color: "var(--text-secondary)", margin: "1.5em" }}>
            Loading...
          </div>
        )}
        {error && (
          <div style={{ color: "#f50057", fontWeight: 500, margin: "1.5em" }}>
            {error}
          </div>
        )}
        <NoteDetail
          note={stagedNote || selectedNote}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onChange={handleNoteChange}
        />
      </main>
    </div>
  );
}

export default NotesLayout;
