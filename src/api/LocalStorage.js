const initialNote = {
    id: 0,
    name: 'Sample Note',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1,
    body: "",
    suggestions: [],
    subnotes: []
}

// get note from local storage by id
export const getNote = (id) => {
    let notes = localStorage.getItem('notes');
    if (notes) {
        notes = JSON.parse(notes);
    } else {
        notes = []
    }

    let note = notes.find(note => note.id == id);
    console.log(note);
    if (note) {
        return(note);
    } else {
        window.location.href = '/new';
    }
}

// save note to local storage
export const saveNote = (note, id) => {

    let notes = localStorage.getItem('notes');
    if (notes) {
        notes = JSON.parse(notes);
    } else {
        notes = [];
    }

    let noteIndex = notes.findIndex(note => note.id == id);
    notes[noteIndex] = note;
    localStorage.setItem('notes', JSON.stringify(notes));
}


// create a new note
export function createNote(name, body) {
    console.log('Creating a new note');

    let notes = localStorage.getItem('notes');
    if (notes) {
        notes = JSON.parse(notes);
    } else {
        notes = [];
    }

    let note = {
        ...initialNote,
        id: notes.length + 1,
        name: name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        body: body,
    }

    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));

    // navigate to the new note
    window.location.href = `/notes/${note.id}`;

}

export function saveNotesToLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes))
}

export function getNotesFromLocalStorage() {
    let notes = localStorage.getItem('notes')
    if (notes) {
        return(JSON.parse(notes))
    } else {
        return null
    }
}



export function deleteNote(id) {
    let result = window.confirm("Delete this note forever?");
    if (result === true) {
      let notes = localStorage.getItem('notes')
      if (notes) {
        notes = JSON.parse(notes)
        let noteIndex = notes.findIndex(note => note.id === id)
        notes.splice(noteIndex, 1)
        localStorage.setItem('notes', JSON.stringify(notes))
        window.location.href = '/new'
      } else {
        notes = []
        return
      }
    } else {
        return
    }
  }



  export function loadContext() {
    let context = localStorage.getItem('context');
    if (context) {
        return (context);
    }
}

export function saveContext(content) {
    localStorage.setItem('context', content);
}


export function loadInstructions() {
    let instructions = localStorage.getItem('instructions');
    if (instructions) {
        return (instructions);
    }
}

export function saveInstructions(instructions) {
    localStorage.setItem('instructions', instructions);
}