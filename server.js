const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req,res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

app.get('api/notes/:id', (req,res) => {
    let noteData = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    let noteID = (req.params.id);
    res.json(noteData[Number(noteID)]);
})

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/pages/index.html'));
});

app.post('/api/notes', (req, res) => {
    let noteData = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    req.body.id = (noteData.length).toString();
    noteData.push(req.body);
    fs.writeFileSync('./db/db.json', JSON.stringify(noteData));
    console.log("Note saved");
    res.json(noteData);
});

app.delete('/api/notes/:id', (req,res) => {
    let noteData = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    let noteID = (req.params.id);
    let newID = 0;
    console.log("Note deleted");
    noteData = noteData.filter(currentNote => {
        return currentNote.id != noteID;
    })
    for (currentText of noteData) {
        currentText.id = newID.toString();
        newID++;
    }
    fs.writeFileSync('./db/db.json', JSON.stringify(noteData));
    res.json(noteData);
});

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`);
});


