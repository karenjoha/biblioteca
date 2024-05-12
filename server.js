const express = require('express');
const { connectToCollection } = require('./db');
const { ObjectId } = require('mongodb');

// Crear una instancia de Express
const app = express();
const PORT = process.env.PORT || 3000; // Puerto de escucha para el servidor

// Middleware
app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos desde el directorio 'public'

// Conectar a las colecciones MongoDB Atlas
async function connectToCollections() {
  try {
    const usersCollection = await connectToCollection('users');
    const libraryCollection = await connectToCollection('library');
    
    return { usersCollection, libraryCollection };
  } catch (error) {
    console.error("Error al conectar a las colecciones:", error);
    throw error;
  }
}

// Routes
connectToCollections()
  .then(({ usersCollection, libraryCollection }) => {
    // Definir las rutas CRUD para la colección 'users'
    
    app.post('/api/users', async (req, res) => {
      try {
        const { username, password } = req.body;
        await usersCollection.insertOne({ username, password, identifier: "algo aleatorio" });
        res.status(201).send('Usuario registrado correctamente.');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar usuario.');
      }
    });
    //delete
    app.delete("/api/users/:id", async (req, res) => {
      try {
        const id = req.params.id
        const users = await usersCollection.insertOney({username : id})
        // Enviar una respuesta de éxito al cliente
        res.status(201).json({ usuariosDeleted : users })
      } catch (error) {
        // Si ocurre un error, enviar una respuesta de error al cliente
        console.error(error);
        res.status(500).send('Error al registrar usuario.');
      }
    })


    //obtener todos
    app.get("/api/users/all", async (req, res) => {
      try {
        const users = await client.find();
        // Enviar una respuesta de éxito al cliente
        res.status(201).json({ username: users });
      } catch (error) {
        // Si ocurre un error, enviar una respuesta de error al cliente
        console.error(error);
        res.status(500).send('Error al encontrar usuarios.');
      }
    });

    //obtener un usuario
    app.get("/api/users/:id", async (req, res) => {
      try {
        const id= req.params.id
        const users = await client.findOne({username : id})
        // Enviar una respuesta de éxito al cliente
        res.status(201).json({ username : users })
      } catch (error) {
        // Si ocurre un error, enviar una respuesta de error al cliente
        console.error(error);
        res.status(500).send('Error al registrar usuario.');
      }
    })



    // Definir las rutas CRUD para la colección 'library'///////////////////////////////////////////
    //CREATE
    app.post('/api/books', async (req, res) => {
      try {
        const { bookname, author, date, status } = req.body;
        await libraryCollection.insertOne({ bookname, author, date, status });
        res.status(201).send('Libro registrado correctamente.');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar libro.');
      }
    });

    //READ
    //getBy
    app.get("/api/books/getBy", async (req, res) => {
      try {
        // Obtener el parámetro _id de la solicitud
        const { _id } = req.query;
        // Verificar si se proporcionó un _id válido
        if (!_id) {
          return res.status(400).send('Por favor, proporcione un _id válido.');
        }
        // Convertir el _id a ObjectId
        const objectId = new ObjectId(_id);
        // Realizar la consulta en la base de datos utilizando el _id
        const book = await libraryCollection.findOne({ _id: objectId });
        // Verificar si se encontró el libro
        if (!book) {
          return res.status(404).send('No se encontró ningún libro con el _id proporcionado.');
        }
        // Enviar una respuesta de éxito al cliente con el libro encontrado
        res.status(200).json({ book: book });
      } catch (error) {
        // Si ocurre un error, enviar una respuesta de error al cliente
        console.error(error);
        res.status(500).send('Error al encontrar el libro.');
      }
    });
        //getall
        app.get("/api/books/getAll", async (req, res) => {
          try {
            const books = await libraryCollection.find({}).toArray();
            // Enviar una respuesta de éxito al cliente
            res.status(200).json({ books: books });
          } catch (error) {
            // Si ocurre un error, enviar una respuesta de error al cliente
            console.error(error);
            res.status(500).send('Error al encontrar libros.');
          }
        });
    //UPDATE
    app.put("/api/books/update", async (req, res) => {
      try {
        // Obtener el parámetro _id de la solicitud
        const { _id } = req.query;
        // Verificar si se proporcionó un _id válido
        if (!_id) {
          return res.status(400).send('Por favor, proporcione un _id válido.');
        }
        // Convertir el _id a ObjectId
        const objectId = new ObjectId(_id);
        // Obtener los campos actualizados del cuerpo de la solicitud
        const { bookname, author, date, status } = req.body;
        // Realizar la actualización en la base de datos utilizando el _id
        const result = await libraryCollection.updateOne(
          { _id: objectId },
          { $set: { bookname, author, date, status } }
        );
        // Verificar si se actualizó el libro
        if (result.modifiedCount === 1) {
          return res.status(200).send('Libro actualizado correctamente.');
        } else {
          return res.status(404).send('No se realizo ningun cambio al id seleccionado');
        }
      } catch (error) {
        // Si ocurre un error, enviar una respuesta de error al cliente
        console.error(error);
        res.status(500).send('Error al actualizar el libro.');
      }
    });
    

    //DELETE
    app.delete("/api/books/delete", async (req, res) => {
      try {
        // Obtener el parámetro _id de la solicitud
        const { _id } = req.query;
        // Verificar si se proporcionó un _id válido
        if (!_id) {
          return res.status(400).send('Por favor, proporcione un _id válido.');
        }
        // Convertir el _id a ObjectId
        const objectId = new ObjectId(_id);
        // Realizar la consulta en la base de datos utilizando el _id
        const book = await libraryCollection.deleteOne({ _id: objectId });
        // Verificar si se encontró el libro
        if (!book) {
          return res.status(404).send('No se encontró ningún libro con el _id proporcionado.');
        }
        // Enviar una respuesta de éxito al cliente con el libro encontrado
        res.status(200).json({ book: book });
      } catch (error) {
        // Si ocurre un error, enviar una respuesta de error al cliente
        console.error(error);
        res.status(500).send('Error al encontrar el libro.');
      }
    });

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor en ejecución en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a las colecciones:", error);
  });
