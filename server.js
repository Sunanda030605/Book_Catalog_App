const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const url = process.env.MONGO_URI;
const dbName = "bookCatalogDB";

app.use(cors({
  origin: 'https://glittering-meringue-9287e2.netlify.app'  
}));
app.use(bodyParser.json());

let db;

MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log("Connected to MongoDB Atlas");
  })
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.get('/books', async (req, res) => {
  try {
    const books = await db.collection('books').find().toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.post('/books', async (req, res) => {
  try {
    const newBook = req.body;
    const result = await db.collection('books').insertOne(newBook);
    res.json({ _id: result.insertedId, ...newBook });
  } catch (err) {
    res.status(500).json({ error: "Failed to add book" });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.collection('books').deleteOne({ _id: new ObjectId(id) });
    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete book" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
