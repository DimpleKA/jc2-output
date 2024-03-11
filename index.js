// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB connection URL
const url = 'mongodb+srv://Dimpleusername:Dimple999@cluster0.l6frpvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'legal-aid-db';
const collectionName = 'formdatas';

// API endpoint to fetch data from MongoDB
app.get('/api/data', async (req, res) => {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const cursor = collection.find({});

    const documents = await cursor.toArray(); // Convert cursor to array

    client.close();

    // Modify documents to properly display position coordinates
    const modifiedDocuments = documents.map(doc => {
      return {
        ...doc,
        position: doc.position ? `Latitude: ${doc.position.latitude}, Longitude: ${doc.position.longitude}` : ''
      };
    });

    res.json(modifiedDocuments); // Send the modified documents as JSON response
  } catch (error) {
    console.error('Error connecting to MongoDB or fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if server is connected to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Server connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.listen(port, () => console.log(`Server running on port ${port}`));
