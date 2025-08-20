import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

export async function queryGemini(prompt: string): Promise<string> {
  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    console.log('🚀 Enviando prompt a Gemini:', prompt);

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('📨 Respuesta cruda de Gemini:', JSON.stringify(data, null, 2));

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || typeof text !== 'string') {
      throw new Error('❌ Respuesta inválida o vacía de Gemini');
    }

    console.log('✅ Texto generado por Gemini:', text);
    return text;
  } catch (error) {
    console.error('❌ Error al consultar Gemini:', error);
    throw error;
  }
}
