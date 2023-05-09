const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Get Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.listen(PORT, ()=> {
    console.log(`Note Taker app listening athttp://localhost:${PORT}`)
});
