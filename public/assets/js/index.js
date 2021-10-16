let noteList;
let noteText;
let noteTitle;
let saveNoteBtn;
let newNoteBtn;

//working on a new code

if (window.location.pathname === "/notes") {

  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  noteList = document.querySelector('list-container .list-group');
  newNoteBtn = document.querySelector('.new-note');
  saveNoteBtn = document.querySelector('save-note');

}

const show = (elem) => {
  
  elem.style.display = "inline";

};

const hide = (elem) => {

  elem.style.display = "none";

};

let activeNote = {};

//a function to get note

const getNotes = () =>

  fetch("/api/notes", {

    method: "GET", 
    headers: {

      "Content-Type": "application/json",

    },
  });

//a funtion to save note

  const saveNote = (note) =>
    fetch ("/api/notes" , {

      method: "POST" , 
      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify(note),

    });

//a function for deleting a note

const deleteNote = (id) =>

    fetch(`/api/notes/${id}`, {

      method: "DELETE",
      headers: {

        "Content-Type": "application/json",

      },

    });

const renderActiveNote = () => {

      hide(saveNoteBtn);
    
      if (activeNote.id) {

        console.log(activeNote);

        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = activeNote.title;
        noteText.value = activeNote.text;
        
      } else {

        noteTitle.removeAttribute('readonly');
        noteText.removeAttribute('readonly');
        noteTitle.value = '';
        noteText.value = '';

      }

};

const workNoteSave = () => {
  const newNote = {

    title: noteTitle.value,
    text: noteText.value,

  }
};
saveNote(newNote).then (() => {

  getAndRenderNotes();
  renderActiveNote();

});


// Delete the clicked note

var handleNoteDelete = function(event) {

  // prevents the click listener for the list from being called when the button inside of it is clicked

  event.stopPropagation();

  var note = $(this)

    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {

    activeNote = {};

  }

  deleteNote(note.id).then(function() {

    getAndRenderNotes();
    renderActiveNote();

  });
};

// Sets the activeNote and displays it

var handleNoteView = function() {

  activeNote = $(this).data();
  renderActiveNote();

};

// Sets the activeNote to and empty object and allows the user to enter a new note

var handleNewNoteView = function() {

  activeNote = {};
  renderActiveNote();

};

// If a note's title or text are empty, hide the save button

// Or else show it

var handleRenderSaveBtn = function() {

  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {

    $saveNoteBtn.hide();

  } else {

    $saveNoteBtn.show();

  }
};

// Render's the list of note titles

var renderNoteList = function(notes) {

  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {

    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);

  }

  $noteList.append(noteListItems);

};

// Gets notes from the db and renders them to the sidebar

var getAndRenderNotes = function() {

  return getNotes().then(function(data) {

    renderNoteList(data);

  });
};

$saveNoteBtn.on("click", handleNoteSave);

$noteList.on("click", ".list-group-item", handleNoteView);

$newNoteBtn.on("click", handleNewNoteView);

$noteList.on("click", ".delete-note", handleNoteDelete);

$noteTitle.on("keyup", handleRenderSaveBtn);

$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes

getAndRenderNotes();