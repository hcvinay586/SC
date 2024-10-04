const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Ransomware = require('./models/Ransomware');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/ransomwareDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://hcvinay:0vFte0Solzgxt3fs@cluster0.tbvux.mongodb.net/Ransomeware')

// Create Ransomware
app.post('/ransomware', (req, res) => {
    const newRansomware = new Ransomware(req.body);
    newRansomware.save()
        .then(() => res.status(201).send("Record created"))
        .catch(err => res.status(400).send(err));
});

// Get All Ransomware Records
app.get('/api/ransomware', (req, res) => {
    Ransomware.find()
        .then(records => res.status(200).json(records))
        .catch(err => res.status(500).send(err));
});

// Get a Specific Record
app.get('/ransomware/:id', (req, res) => {
    Ransomware.findById(req.params.id)
        .then(record => res.status(200).json(record))
        .catch(err => res.status(404).send("Record not found"));
});

// Update a Record
app.put('/ransomware/:id', (req, res) => {
    Ransomware.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(record => res.status(200).json(record))
        .catch(err => res.status(400).send(err));
});

// Delete a Record
app.delete('/ransomware/:id', (req, res) => {
    Ransomware.findByIdAndDelete(req.params.id)
        .then(() => res.status(204).send())
        .catch(err => res.status(400).send(err));
});

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
