import React from "react";
import PropTypes from "prop-types";
import "./NotesSidebar.css";

// PUBLIC_INTERFACE
function NotesSidebar({ notes, selectedNoteId, onSelectNote, onAddNote }) {
  /**
   * Sidebar displaying a list of notes and controls to add a note.
   * 
   * @param {Object[]} notes - List of note objects
   * @param {string} selectedNoteId - Currently selected note id
   * @param {Function} onSelectNote - Handler for selecting a note
   * @param {Function} onAddNote - Handler for adding a new note
   */
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Notes</h2>
        <button className="add-note-btn" onClick={onAddNote} title="Add note">＋</button>
      </div>
      <ul className="note-list">
        {notes.length === 0 && (
          <li className="note-list-empty">No notes yet.</li>
        )}
        {notes.map(note => (
          <li
            key={note.id}
            className={`note-list-item${note.id === selectedNoteId ? " selected" : ""}`}
            onClick={() => onSelectNote(note.id)}
            tabIndex={0}
            role="button"
            aria-pressed={note.id === selectedNoteId}
          >
            <div className="note-list-title">{note.title || "Untitled"}</div>
            <div className="note-list-modified">
              {note.updated_at ? new Date(note.updated_at).toLocaleString() : ""}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

NotesSidebar.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    updated_at: PropTypes.string,
  })).isRequired,
  selectedNoteId: PropTypes.string,
  onSelectNote: PropTypes.func.isRequired,
  onAddNote: PropTypes.func.isRequired,
};

export default NotesSidebar;
