const express = require('express');
const path = require('path');
const {
  crearBaseDeDatos,
  crearColeccion,
  insertarDocumento,
} = require('./mongoOperations');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta para servir el formulario inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para procesar la solicitud y realizar operaciones en MongoDB
app.post('/basedatos', async (req, res) => {
  const { db, coleccion, nombre, edad } = req.body;

  try {
    await crearBaseDeDatos(db); // Crear la base de datos
    await crearColeccion(db, coleccion); // Crear la colección
    await insertarDocumento(db, coleccion, { nombre, edad }); // Insertar el documento

    res.send(`
      <h1>Operación Exitosa</h1>
      <p>Base de Datos: ${db}</p>
      <p>Colección: ${coleccion}</p>
      <p>Documento Insertado: Nombre=${nombre}, Edad=${edad}</p>
      <a href="/">Volver al inicio</a>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error procesando la solicitud.');
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
