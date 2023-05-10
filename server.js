const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

let Notes = require('./Develop/db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function createNote (body, notesArray) {
  const newNote = body;
  if (!Array.isArray(notesArray)) {
    notesArray = [];
  }
  if (notesArray.length === 0) {
    notesArray.push(0);
  }
  body.id = notesArray[0];
  notesArray[0]++;
  notesArray.push(newNote);
  fs.writeFileSync(
      path.join(__dirname, './Develop/db/db.json'),
      JSON.stringify(notesArray, null, 2)
  );
  return notesArray;
}

app.get('/api/notes', (req, res) => {
  res.json(Notes);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.post('/api/notes', (req, res) => {
    Notes = createNote(req.body, Notes);
    res.json(Notes.slice(1));
});

app.listen(PORT, ()=> {
    console.log(`Note Taker app listening at http://localhost:${PORT}`)
});