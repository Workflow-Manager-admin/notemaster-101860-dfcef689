import React, { useState } from "react";
import NotesSidebar from "./NotesSidebar";
import NoteDetail from "./NoteDetail";
import "./NotesLayout.css";

// Dummy data for future API hookup
const DUMMY_NOTES = [
  {
    id: "1",
    title: "First Note",
    body: "This is your first note!",
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Second Note",
    body: "You can edit or delete notes.",
    updated_at: new Date().toISOString()
  }
];

// PUBLIC_INTERFACE
function NotesLayout() {
  /**
   * Main layout of the note-taking app, includes sidebar and detail area.
   * Will eventually connect handlers to backend API.
   */
  const [notes, setNotes] = useState(DUMMY_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState(notes.length > 0 ? notes[0].id : null);

  // Find selected note
  const selectedNote = notes.find(n => n.id === selectedNoteId);

  // Handler to select note
  const handleSelectNote = (noteId) => {
    setSelectedNoteId(noteId);
  };

  // Handler to add note
  const handleAddNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "",
      body: "",
      updated_at: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  // Handler to update note in the list
  const handleNoteChange = (updatedNote) => {
    setNotes(notes =>
      notes.map((note) => (note.id === updatedNote.id ? { ...note, ...updatedNote } : note))
    );
  };

  // Handler to save note (dummy, for later API)
  const handleSaveNote = (updatedNote) => {
    setNotes(notes =>
      notes.map((note) => (note.id === updatedNote.id ? { ...note, ...updatedNote, updated_at: new Date().toISOString() } : note))
    );
  };

  // Handler to delete note (dummy, for later API)
  const handleDeleteNote = (noteId) => {
    setNotes(notes => notes.filter(note => note.id !== noteId));
    // Auto-select another note if exists
    setTimeout(() => {
      if (notes.length > 1) {
        const remaining = notes.filter(note => note.id !== noteId);
        setSelectedNoteId(remaining[0]?.id || null);
      } else {
        setSelectedNoteId(null);
      }
    }, 0);
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
        <NoteDetail
          note={selectedNote}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          onChange={handleNoteChange}
        />
      </main>
    </div>
  );
}

export default NotesLayout;
