const { MongoClient, ServerApiVersion } = require('mongodb');

const uri2 = "mongodb+srv://karenjoha3838:gwhuB4UEhZJ47peX@library.k5ew2us.mongodb.net/library" 

// asi
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri2, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
/**
 * 
 * @returns 
 */
async function connectToCollection(collectionName) {

    try {
    const client2 = await client.connect()
    const database = client2.db("library");
        const collection = database.collection(collectionName);
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

        return collection;
    } catch (error) {
        console.error("Error al conectar a la colección:", error);
        throw error;
    }
}

module.exports = { connectToCollection };
