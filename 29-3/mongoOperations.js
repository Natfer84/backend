const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';

async function connectToMongo() {
  const client = new MongoClient(url);
  await client.connect();
  return client;
}

// Crear una base de datos
async function crearBaseDeDatos(nombreDb) {
  const client = await connectToMongo();
  const db = client.db(nombreDb);
  console.log(`Base de datos '${nombreDb}' creada o conectada.`);
  await client.close();
}

// Crear una colección
async function crearColeccion(nombreDb, coleccion) {
  const client = await connectToMongo();
  const db = client.db(nombreDb);
  await db.createCollection(coleccion);
  console.log(`Colección '${coleccion}' creada en la base de datos '${nombreDb}'.`);
  await client.close();
}

// Insertar un documento
async function insertarDocumento(nombreDb, coleccion, documento) {
  const client = await connectToMongo();
  const db = client.db(nombreDb);
  const collection = db.collection(coleccion);
  const resultado = await collection.insertOne(documento);
  console.log(`Documento insertado con ID: ${resultado.insertedId}`);
  await client.close();
}

async function mostrarTodos(nombreDb, coleccion) {
    const client = await connectToMongo();
    try {
      const db = client.db(nombreDb);
      const collection = db.collection(coleccion);
      const documentos = await collection.find({}).toArray();
      console.log('Documentos:', documentos);
      return documentos;
    } finally {
      await client.close();
    }
  }
  

module.exports = {
  crearBaseDeDatos,
  crearColeccion,
  insertarDocumento,
};
