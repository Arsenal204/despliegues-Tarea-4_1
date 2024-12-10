// Importamos las bibliotecas necesarias.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Estructura de datos: concesionarios y coches
let concesionarios = [
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

// ** Endpoints **

// Obtener todos los concesionarios
app.get("/concesionarios", (request, response) => {
  response.json(concesionarios);
});

// Crear un nuevo concesionario
app.post("/concesionarios", (request, response) => {
  const newConcesionario = {
    id: concesionarios.length + 1,
    ...request.body,
    coches: [],
  };
  concesionarios.push(newConcesionario);
  response.json({ message: "Concesionario creado", concesionario: newConcesionario });
});

// Obtener un concesionario por ID
app.get("/concesionarios/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const concesionario = concesionarios.find((c) => c.id === id);
  if (!concesionario) return response.status(404).json({ error: "Concesionario no encontrado" });
  response.json(concesionario);
});

// Actualizar un concesionario
app.put("/concesionarios/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const index = concesionarios.findIndex((c) => c.id === id);
  if (index === -1) return response.status(404).json({ error: "Concesionario no encontrado" });
  concesionarios[index] = { ...concesionarios[index], ...request.body };
  response.json({ message: "Concesionario actualizado", concesionario: concesionarios[index] });
});

// Borrar un concesionario
app.delete("/concesionarios/:id", (request, response) => {
  const id = parseInt(request.params.id);
  concesionarios = concesionarios.filter((c) => c.id !== id);
  response.json({ message: "Concesionario eliminado" });
});

// Obtener coches de un concesionario
app.get("/concesionarios/:id/coches", (request, response) => {
  const id = parseInt(request.params.id);
  const concesionario = concesionarios.find((c) => c.id === id);
  if (!concesionario) return response.status(404).json({ error: "Concesionario no encontrado" });
  response.json(concesionario.coches);
});

// Añadir un coche a un concesionario
app.post("/concesionarios/:id/coches", (request, response) => {
  const id = parseInt(request.params.id);
  const concesionario = concesionarios.find((c) => c.id === id);
  if (!concesionario) return response.status(404).json({ error: "Concesionario no encontrado" });
  const newCoche = { id: concesionario.coches.length + 1, ...request.body };
  concesionario.coches.push(newCoche);
  response.json({ message: "Coche añadido", coche: newCoche });
});

// Obtener un coche específico de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = parseInt(request.params.id);
  const cocheId = parseInt(request.params.cocheId);
  const concesionario = concesionarios.find((c) => c.id === id);
  if (!concesionario) return response.status(404).json({ error: "Concesionario no encontrado" });
  const coche = concesionario.coches.find((car) => car.id === cocheId);
  if (!coche) return response.status(404).json({ error: "Coche no encontrado" });
  response.json(coche);
});

// Actualizar un coche de un concesionario
app.put("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = parseInt(request.params.id);
  const cocheId = parseInt(request.params.cocheId);
  const concesionario = concesionarios.find((c) => c.id === id);
  if (!concesionario) return response.status(404).json({ error: "Concesionario no encontrado" });
  const index = concesionario.coches.findIndex((car) => car.id === cocheId);
  if (index === -1) return response.status(404).json({ error: "Coche no encontrado" });
  concesionario.coches[index] = { ...concesionario.coches[index], ...request.body };
  response.json({ message: "Coche actualizado", coche: concesionario.coches[index] });
});

// Borrar un coche de un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = parseInt(request.params.id);
  const cocheId = parseInt(request.params.cocheId);
  const concesionario = concesionarios.find((c) => c.id === id);
  if (!concesionario) return response.status(404).json({ error: "Concesionario no encontrado" });
  concesionario.coches = concesionario.coches.filter((car) => car.id !== cocheId);
  response.json({ message: "Coche eliminado" });
});
