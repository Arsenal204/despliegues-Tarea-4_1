/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Inicializamos la aplicación
const app = express();
const uri =
  "mongodb+srv://diegorobles031204:fWw0pLPynOZjjkmU@cluster0.y72kv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let db;

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, async () => {
  await client.connect();
  db = await client.db("mi-proyecto");

  console.log(`Servidor desplegado en puerto: ${port}`);
});
// Estructura de datos: concesionarios y coches
/**let concesionarios = [
  {
    id: 1,
    nombre: "Concesionario A",
    direccion: "Calle Falsa 123",
    coches: [
      { id: 1, modelo: "Corsa", cv: 90, precio: 12000 },
      { id: 2, modelo: "Astra", cv: 110, precio: 16000 },
    ],
  },
];
*/

app.get("/concesionarios", async (req, res) => {
  const concesionarios = await db
    .collection("concesionarios")
    .find({})
    .toArray();
  res.json(concesionarios);
});

// Crear un nuevo concesionario
app.post("/concesionarios", async (req, res) => {
  await db.collection("concesionarios").insertOne(req.body);
  res.json({ message: "Concesionario añadido" });
});

// Obtener un concesionario por ID
app.get("/concesionarios/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const concesionario = await db
    .collection("concesionarios")
    .findOne({ _id: id });
  res.json(concesionario);
});

// Actualizar un concesionario
app.put("/concesionarios/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  await db
    .collection("concesionarios")
    .updateOne({ _id: id }, { $set: req.body });
  res.json({ message: "Concesionario actualizado" });
});

// Borrar un concesionario
app.delete("/concesionarios/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  await db.collection("concesionarios").deleteOne({ _id: id });
  res.json({ message: "Concesionario eliminado" });
});

// Listar coches de un concesionario
app.get("/concesionarios/:id/coches", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const concesionario = await db
    .collection("concesionarios")
    .findOne({ _id: id });
  res.json(concesionario?.coches || []);
});

// Añadir un coche a un concesionario
app.post("/concesionarios/:id/coches", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const nuevoCoche = req.body;
  await db
    .collection("concesionarios")
    .updateOne({ _id: id }, { $push: { coches: nuevoCoche } });
  res.json({ message: "Coche añadido" });
});
