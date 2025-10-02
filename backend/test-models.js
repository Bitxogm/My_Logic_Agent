// test-models.js
require('dotenv').config();

async function testModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    const data = await response.json();
    console.log('Modelos disponibles:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testModels();