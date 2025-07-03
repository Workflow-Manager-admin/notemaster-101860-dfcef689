//
// PUBLIC_INTERFACE
// api.js: Frontend helpers for notes backend API.
//
// Provides CRUD functions for notes management via REST API.
// Endpoint base URL is assumed to be relative to current location for development.
//

const API_BASE = process.env.REACT_APP_BACKEND_API_URL || ""; // can override via env or set to empty for proxy/dev

/**
 * Handle JSON response and errors
 */
async function handleResponse(response) {
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || response.statusText);
  }
  return response.status === 204 ? null : response.json();
}

// PUBLIC_INTERFACE
export async function getNotes() {
  /**
   * Get all notes.
   * @returns Array of note objects.
   */
  const resp = await fetch(`${API_BASE}/notes`);
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  /**
   * Create a new note.
   * @param {Object} note - Note object with {title, body}
   * @returns Created note object.
   */
  const resp = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function updateNote(noteId, note) {
  /**
   * Update an existing note.
   * @param {string} noteId - Note id to update
   * @param {Object} note - Note object with updated fields
   * @returns Updated note object.
   */
  const resp = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return handleResponse(resp);
}

// PUBLIC_INTERFACE
export async function deleteNote(noteId) {
  /**
   * Delete a note.
   * @param {string} noteId - Note id to delete
   * @returns {null}
   */
  const resp = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: "DELETE"
  });
  return handleResponse(resp); // should return null
}

// PUBLIC_INTERFACE
export async function getNote(noteId) {
  /**
   * Fetch a single note by id.
   * @param {string} noteId - Note ID
   * @returns Note object
   */
  const resp = await fetch(`${API_BASE}/notes/${noteId}`);
  return handleResponse(resp);
}
