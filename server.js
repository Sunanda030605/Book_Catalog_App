const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;
const url = "mongodb://localhost:27017";
const dbName = "bookCatalogDB";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


let db;

// MongoDB connection
MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  })
  .catch(err => console.error(err));

// Routes
app.get('/books', async (req, res) => {
  const books = await db.collection('books').find().toArray();
  res.json(books);
});

app.post('/books', async (req, res) => {
  const newBook = req.body;
  const result = await db.collection('books').insertOne(newBook);
  //res.json(result.ops);
  res.json({ _id: result.insertedId, ...newBook });
});

app.delete('/books/:id', async (req, res) => {
  const id = req.params.id;
  const result = await db.collection('books').deleteOne({ _id: new ObjectId(id) });
  res.json({ deleted: result.deletedCount });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
