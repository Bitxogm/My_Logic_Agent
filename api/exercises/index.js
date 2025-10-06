const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      
      const db = client.db();
      const exercises = await db.collection('exercises').find({}).toArray();
      
      await client.close();
      res.status(200).json(exercises);
    } catch (error) {
      console.error('Error GET:', error);
      res.status(500).json({ error: error.message });
    }
  } 
  else if (req.method === 'POST') {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      
      const db = client.db();
      const exercise = {
        ...req.body,
        createdAt: new Date().toISOString()
      };
      
      const result = await db.collection('exercises').insertOne(exercise);
      
      await client.close();
      res.status(201).json({ 
        _id: result.insertedId,
        ...exercise 
      });
    } catch (error) {
      console.error('Error POST:', error);
      res.status(500).json({ error: error.message });
    }
  } 
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}