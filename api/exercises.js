const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    
    if (req.method === 'GET') {
      const exercises = await db.collection('exercises').find({}).toArray();
      res.json(exercises);
    } else if (req.method === 'POST') {
      const result = await db.collection('exercises').insertOne({
        ...req.body,
        createdAt: new Date()
      });
      res.status(201).json({ _id: result.insertedId, ...req.body });
    }
    
    await client.close();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}