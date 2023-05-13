const fs = require("fs");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;

const app = express();

let Notes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function createNote (body, notesArray) {
  console.log("createNote: body =", body);
  console.log("createNote: notesArray =", notesArray);

  const newNote = body;
  if (!Array.isArray(notesArray)) {
    notesArray = [];
  }
  
  if (notesArray.length === 0) {
    newNote.id = 1;
  } else {
    newNote.id = notesArray[notesArray.length - 1].id + 1;
  }
  
  if (typeof newNote === 'object' && newNote !== null && newNote.title && newNote.text) {
    console.log("createNote: pushing newNote =", newNote);
    notesArray.push(newNote);
  } else if (typeof newNote === 'string' && newNote.trim() !== '') {
    console.log("createNote: pushing newNote.trim() =", newNote.trim());
    notesArray.push(newNote.trim());
  }
  
  fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(notesArray, null, 2)
  );
  console.log("createNote: returning notesArray =", notesArray);
  return notesArray;
}
app.get('/api/notes', (req, res) => {
  try {
    Notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    res.json(Notes);
  } catch (error) {
    console.error("Error reading db.json:", error);
    res.sendStatus(500); // Internal Server Error
  }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/api/notes', (req, res) => {
  console.log(req.body);
  Notes = createNote(req.body, Notes);
  res.json(Notes.slice(1));
});

app.delete('/api/notes/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedNotes = Notes.filter((note, index) => index !== 0 && note.id !== id);
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(updatedNotes, null, 2)
    );
    Notes = updatedNotes;
    res.json(Notes);
  } catch (error) {
    console.error("Error writing to db.json:", error);
    res.sendStatus(500); // Internal Server Error
  }
});

app.listen(PORT, ()=> {
    console.log(`Note Taker app listening at http://localhost:${PORT}`)
});
