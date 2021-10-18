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

  };

saveNote(newNote).then (() => {

  getAndRenderNotes();
  renderActiveNote();

});
};

// deleting note

const handleNoteDelete = (event) => {

  event.stopPropagation();

  const note = event.target;
  const noteName = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteName) {

    activeNote = {};

  }

  deleteNote(noteId).then(() => {

    getAndRenderNotes();
    renderActiveNote();

  });
};

// Sets the activeNote and displays it

const handleNoteView = (event) => {

  event.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));

  console.log(activeNote);
  renderActiveNote();
  console.log("working note")

};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (event) => {

  activeNote = {};
  renderActiveNote();

};

const handleRenderSaveBtn = () => {

  if (!noteTitle.value.trim() || !noteText.value.trim()) {

    hide(saveNoteBtn);

  } else {

    show(saveNoteBtn);

  }
};

// Render the list of note titles

const renderNoteList = async (notes) => {

  let jsonNotes = await notes.json();

  if (window.location.pathname === '/notes') {

    noteList.forEach((element) => (element.innerHTML = ''));

  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button

  const createList = (text, deleteBtn = true) => {

    const liElement = document.createElement('li');
    liElement.classList.add('list-group-item');

    const spanElement = document.createElement('span');
    spanElement.classList.add('list-item-title');
    spanElement.innerText = text;

    console.log(spanElement);
    spanEl.addEventListener('click', handleNoteView);

    liElement.append(spanElement);

    if (deleteBtn) {

      const deleteBtnElement = document.createElement('i');
      deleteBtnElement.classList.add(

        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'

      );
      deleteBtnElement.addEventListener('click', handleNoteDelete);

      liElement.append(delBtnEl);
    }

    return liElement;
  };

  if (jsonNotes.length === 0) {

    noteListItems.push(createList('No saved Notes', false));

  }

  jsonNotes.forEach((note) => {

    const li = createList(note.title);

    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {

    noteListItems.forEach((note) => noteList[0].append(note));

  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {

  saveNoteBtn.addEventListener('click', workNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();