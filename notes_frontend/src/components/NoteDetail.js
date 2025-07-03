import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./NoteDetail.css";

// PUBLIC_INTERFACE
function NoteDetail({ note, onSave, onDelete, onChange }) {
  /**
   * Note detail view and editor.
   *
   * @param {Object} note - The note to display/edit. May be null.
   * @param {Function} onSave - Handler called to save the note.
   * @param {Function} onDelete - Handler called to delete the note.
   * @param {Function} onChange - Handler called on note edits (title/body).
   */
  const [editNote, setEditNote] = useState(note);

  useEffect(() => {
    setEditNote(note);
  }, [note]);

  if (!editNote) {
    return (
      <div className="note-detail note-detail-empty">
        <p>Select a note or create a new note to get started.</p>
      </div>
    );
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...editNote, [name]: value };
    setEditNote(updated);
    if (onChange) onChange(updated);
  };

  const handleSave = () => {
    if (onSave) onSave(editNote);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(editNote.id);
  };

  return (
    <div className="note-detail">
      <input
        className="note-title-input"
        name="title"
        type="text"
        placeholder="Note Title"
        value={editNote.title || ""}
        onChange={handleFieldChange}
        autoFocus
      />
      <textarea
        className="note-body-textarea"
        name="body"
        placeholder="Write your note..."
        value={editNote.body || ""}
        onChange={handleFieldChange}
        rows={10}
      />
      <div className="note-actions">
        <button className="save-btn" onClick={handleSave} disabled={!editNote.title && !editNote.body}>
          Save
        </button>
        <button className="delete-btn" onClick={handleDelete} disabled={!editNote.id}>
          Delete
        </button>
      </div>
      {editNote.updated_at && (
        <div className="note-timestamp">
          Last updated: {new Date(editNote.updated_at).toLocaleString()}
        </div>
      )}
    </div>
  );
}

NoteDetail.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string,
    updated_at: PropTypes.string,
  }),
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  onChange: PropTypes.func,
};

export default NoteDetail;
