require('dotenv').config(); // Cargar variables de entorno desde .env

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI; // Usar la variable de entorno

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToCollection(collectionName) {
  try {
    const client2 = await client.connect();
    const database = client2.db("library");
    const collection = database.collection(collectionName);
    console.log("¡Conexión exitosa a MongoDB!");
    return collection;
  } catch (error) {
    console.error("Error al conectar a la colección:", error);
    throw error;
  }
}

module.exports = { connectToCollection };
