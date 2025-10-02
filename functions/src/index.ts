import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { setGlobalOptions } from "firebase-functions";
import { MongoClient, Db } from "mongodb";

// --- CONFIGURACIÓN GLOBAL ---
setGlobalOptions({ maxInstances: 10 });

// --- CONEXIÓN A MONGODB ---

// Declaramos las variables, pero las inicializamos DENTRO de la función.
let cachedDb: Db;
let client: MongoClient | null = null; // Inicializamos a null para control

/**
 * Conecta a MongoDB o devuelve la conexión en caché.
 * @returns {Promise<Db>} La instancia de la base de datos de MongoDB.
 */
async function connectToDatabase(): Promise<Db> {
  // 1. Si la conexión ya existe, la devolvemos inmediatamente
  if (cachedDb) {
    return cachedDb;
  }
  
  // 2. OBTENEMOS LA URI DE FORMA SEGURA DENTRO DE LA FUNCIÓN
  const uri = process.env.MONGO_URI; 

  if (!uri) {
      logger.error("Error: MONGO_URI no está configurada. Fallo de inicialización.");
      // Lanzamos un error que no confunda al Healthcheck, sino que avise de la configuración
      throw new HttpsError('internal', 'La base de datos no está configurada.');
  }

  // 3. Creamos o reutilizamos el cliente
  if (!client) {
    client = new MongoClient(uri); // La URI SÍ es un string aquí
  }
  
  // 4. Conectamos y obtenemos la DB
  await client.connect(); 
  
  const dbName = new URL(uri).pathname.split("/")[1] || "logic_agent_db";
  
  const db = client.db(dbName);
  
  // 5. Guardar y devolver
  cachedDb = db;
  return cachedDb;
}

// --- FUNCIÓN PRINCIPAL DEL AGENTE DE LÓGICA (V2) ---

export const logicaAgent = onCall(async ({ data, auth }) => {
  try {
    const db = await connectToDatabase();

    const logsCollection = db.collection("logic_agent_logs");

    const resultadoIA = "Simulación de respuesta de IA procesada y lista.";
    const userId = auth?.uid;

    await logsCollection.insertOne({
      query: data,
      result: resultadoIA,
      timestamp: new Date(),
      user: userId,
    });

    logger.info("Registro de lógica guardado con éxito.");
    return { status: "success", data: resultadoIA };
  } catch (error) {
    // Si connectToDatabase falla, el HttpsError se propaga
    logger.error("Error al ejecutar logicaAgent:", error);
    // Aseguramos que solo lanzamos HttpsError si no lo es ya
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError(
      "internal",
      "Error interno al procesar la lógica."
    );
  }
});