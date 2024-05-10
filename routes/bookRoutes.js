// routes/bookRoutes.js

const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const authenticateToken = require('../middleware/auth');

// Obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un libro por ID
router.get('/:id', getBook, (req, res) => {
  res.json(res.book);
});

// Agregar un nuevo libro
router.post('/', authenticateToken, async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    year: req.body.year,
    status: req.body.status
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un libro
router.patch('/:id', authenticateToken, getBook, async (req, res) => {
  if (req.body.title != null) {
    res.book.title = req.body.title;
  }
  if (req.body.author != null) {
    res.book.author = req.body.author;
  }
  if (req.body.year != null) {
    res.book.year = req.body.year;
  }
  if (req.body.status != null) {
    res.book.status = req.body.status;
  }

  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un libro
router.delete('/:id', authenticateToken, getBook, async (req, res) => {
  try {
    await res.book.remove();
    res.json({ message: 'Libro eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener un libro por ID
async function getBook(req, res, next) {
  let book;
  try {
    book = await Book.findById(req.params.id);
    if (book == null) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.book = book;
  next();
}

module.exports = router;
