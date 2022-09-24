const express = require('express');
const path = require('path');
const fs = require('fs');


const dbData = require('./db/db.json');

const app = express();

const PORT = process.env.port || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', api);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req,res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});
app.get('api/notes/:id', (req,res) => {
    let dbText = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    let reqId = (req.params.id);
    res.json(dbText[Number(reqId)]);
})

app.post('/api/notes', (req, res) => {
    let note = JSON.parse(fs.readFileSync('./db/db.json', "utf-8"));
    req.body.id = (note.length).toString();
    note.push(req.body);
    fs.writeFileSync('./db/db.json', JSON.stringify(note));
    console.log("Note has been saved!");
    res.json(note);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

