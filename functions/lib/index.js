"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logicaAgent = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const firebase_functions_1 = require("firebase-functions");
const mongodb_1 = require("mongodb");
// --- CONFIGURACIÓN GLOBAL ---
(0, firebase_functions_1.setGlobalOptions)({ maxInstances: 10 });
// --- CONEXIÓN A MONGODB ---
// Declaramos las variables, pero las inicializamos DENTRO de la función.
let cachedDb;
let client = null; // Inicializamos a null para control
/**
 * Conecta a MongoDB o devuelve la conexión en caché.
 * @returns {Promise<Db>} La instancia de la base de datos de MongoDB.
 */
async function connectToDatabase() {
    // 1. Si la conexión ya existe, la devolvemos inmediatamente
    if (cachedDb) {
        return cachedDb;
    }
    // 2. OBTENEMOS LA URI DE FORMA SEGURA DENTRO DE LA FUNCIÓN
    const uri = process.env.MONGO_URI;
    if (!uri) {
        logger.error("Error: MONGO_URI no está configurada. Fallo de inicialización.");
        // Lanzamos un error que no confunda al Healthcheck, sino que avise de la configuración
        throw new https_1.HttpsError('internal', 'La base de datos no está configurada.');
    }
    // 3. Creamos o reutilizamos el cliente
    if (!client) {
        client = new mongodb_1.MongoClient(uri); // La URI SÍ es un string aquí
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
exports.logicaAgent = (0, https_1.onCall)(async ({ data, auth }) => {
    try {
        const db = await connectToDatabase();
        const logsCollection = db.collection("logic_agent_logs");
        const resultadoIA = "Simulación de respuesta de IA procesada y lista.";
        const userId = auth === null || auth === void 0 ? void 0 : auth.uid;
        await logsCollection.insertOne({
            query: data,
            result: resultadoIA,
            timestamp: new Date(),
            user: userId,
        });
        logger.info("Registro de lógica guardado con éxito.");
        return { status: "success", data: resultadoIA };
    }
    catch (error) {
        // Si connectToDatabase falla, el HttpsError se propaga
        logger.error("Error al ejecutar logicaAgent:", error);
        // Aseguramos que solo lanzamos HttpsError si no lo es ya
        if (error instanceof https_1.HttpsError) {
            throw error;
        }
        throw new https_1.HttpsError("internal", "Error interno al procesar la lógica.");
    }
});
//# sourceMappingURL=index.js.map