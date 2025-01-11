const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// Inicializa la aplicación
const app = express();
const port = 3000;


// Ruta para servir el formulario (index.html) Esto le dice a Express que cuando alguien acceda a http://localhost:3000, el servidor debe enviar el archivo index.html 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// Middleware para procesar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir el HTML estático




// Ruta para manejar el envío del formulario
app.post('/basedatos', async (req, res) => {
    const { db, coleccion, nombre, edad } = req.body;

    if (!db || !coleccion || !nombre || !edad) {
        return res.send('Por favor, completa todos los campos.');
    }

    const uri = 'mongodb://127.0.0.1:27017'; // Cambiar si es necesario

    try {
        // Conexión a MongoDB
        const client = new MongoClient(uri);
        await client.connect();

        // Crear base de datos y colección
        const database = client.db(db);
        const collection = database.collection(coleccion);

        // Insertar el primer documento
        const resultado = await collection.insertOne({ nombre, edad: parseInt(edad, 10) });

        // Cerrar conexión
        await client.close();

        // Respuesta al usuario
        res.send(`
            <h1>Base de Datos Creada</h1>
            <p>Nombre de la DB: ${db}</p>
            <p>Nombre de la Colección: ${coleccion}</p>
            <p>Primer Documento Insertado:</p>
            <pre>${JSON.stringify(resultado.ops[0], null, 2)}</pre>
            <a href="/">Volver</a>
        `);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Ocurrió un error al crear la base de datos.');
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
