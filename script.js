let addNote = document.getElementById("add-note");
let theme = document.getElementById("toggleTheme");
let notesContainer = document.getElementById("notes-container");
let dialog = document.getElementById("dialog");
let closeDialog = document.getElementById("close-dialog-btn");
let closeFormDialog = document.getElementById("cancel-form-btn");
let form = document.getElementById("form");
let title = document.getElementById("title");
let content = document.getElementById("content");
let body = document.querySelector("body");
let notes = [];
let titleValue;
let contentValue;
let editingNoteId = null;

function updateFormHeading() {
  const heading = editingNoteId ? "Edit Note" : "Add Note";
  document.querySelector(".form-head h2").textContent = heading;
}

function generateId() {
  return Date.now().toString();
}

// light and dark mode
theme.addEventListener("click", () => {
  let dark = body.classList.toggle("dark");
  localStorage.setItem("dark", dark);
  theme.innerText = dark ? "☀" : "🌙";
});

// edit note
function editNote(noteId) {
  editingNoteId = noteId;

  let editNote = notes.find((note) => {
    return note.id === noteId;
  });
  if (editNote) {
    dialog.showModal();
    updateFormHeading();
    title.value = editNote.title;
    content.value = editNote.content;
  }
}

// delete note
function deleteNote(noteId) {
  notes = notes.filter((note) => note.id !== noteId);
  localStorage.setItem("quick notes", JSON.stringify(notes));

  return getNotes();
}
// close dialog
function close(e) {
  e.preventDefault();
  dialog.close();
  updateFormHeading();
  editingNoteId = null;
}

// openDialog dialog
function openDialog(e) {
  e.preventDefault();
  title.value = ""; // Clear title input
  content.value = ""; // Clear content input
  dialog.showModal();
  updateFormHeading();
  editingNoteId = null;
  title.focus();
}

addNote.addEventListener("click", openDialog);
closeDialog.addEventListener("click", close);
closeFormDialog.addEventListener("click", close);
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    dialog.close();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  titleValue = title.value.trim();
  contentValue = content.value.trim();

  if (!titleValue && !contentValue) {
    // Optional: Prevent saving empty note
    return;
  }

  if (editingNoteId) {
    let index = notes.findIndex((note) => {
      return note.id === editingNoteId;
    });
    if (index !== -1) {
      notes[index].title = titleValue;
      notes[index].content = contentValue;
    }
  } else {
    let note = {
      id: generateId(),
      title: titleValue,
      content: contentValue,
    };
    notes.unshift(note);
  }

  localStorage.setItem("quick notes", JSON.stringify(notes));
  getNotes();
  title.value = "";
  content.value = "";
  editingNoteId = null;
  close(e);
});

function getNotes() {
  notesContainer.innerHTML = ""; // Clear previous notes

  if (notes.length === 0) {
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>No note added yet</h2>
      </div>`;
    return; // No need to continue
  }

  notes.forEach((note) => {
    notesContainer.innerHTML += `
      <div class="note-card">
      <div class="card-head">
<h2>${note.title}</h2>
      <div class="icons">
      <i onclick="editNote('${note.id}')" class="fa-solid fa-pen edit"></i>
      <i onclick="deleteNote('${note.id}')"  class="fa-solid fa-trash delete"></i>
      </div>
      </div>
        <p>${note.content}</p>
      </div>`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  let quickNotes = localStorage.getItem("quick notes");
  if (quickNotes) {
    notes = JSON.parse(quickNotes) || [];
  }
  getNotes(); // call after everything is loaded
  // Proper dark mode restoration
  const darkMode = localStorage.getItem("dark") === "true";
  if (darkMode) {
    body.classList.add("dark");
    theme.innerText = "☀";
  } else {
    theme.innerText = "🌙";
  }
});
