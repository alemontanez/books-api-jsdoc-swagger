import {
  addBook,
  editBook,
  findAllBooks,
  findBookById,
  removeBook
} from '../services/books.service.js'

/**
 * Controladores del modelo Books
 * @module BooksController
 */

/**
 * Controlador para obtener todos los libros.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {void}
 */
export async function getBooks(req, res) {
  try {
    const books = await findAllBooks()
    res.json(books)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}

/**
 * Controlador para obtener un libro por id.
 * @param {Request} req - Objeto de solicitud HTTP con bookId como parámetro.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {void}
 */
export async function getBookById(req, res) {
  const { bookId } = req.params
  try {
    const book = await findBookById(bookId)
    res.json(book)
  } catch (error) {
    console.log(error)
    if (error.message) {
      return res.status(404).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Internal error' })
  }
}

/**
 * Controlador para crear un nuevo libro.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {void}
 */
export async function createBook(req, res) {
  const { title, author, year } = req.body
  try {
    await addBook(title, author, year)
    res.status(201).json('Book added successfully')
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal error' })
  }
}

/**
 * Controlador para actualizar un libro por id.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {void}
 */
export async function updateBook(req, res) {
  const { bookId } = req.params
  const { title, author, year } = req.body
  try {
    await editBook(bookId, title, author, year)
    res.status(200).json('Book updated successfully')
  } catch (error) {
    console.log(error)
    if (error.message === 'Book not found') {
      return res.status(404).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Internal error' })
  }
}

/**
 * Controlador para eliminar un libro por id.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {void}
 */
export async function deleteBook(req, res) {
  const { bookId } = req.params
  try {
    await removeBook(bookId)
    res.status(200).json('Book deleted successfully')
  } catch (error) {
    console.log(error)
    if (error.message === 'Book not found') {
      return res.status(404).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Internal error' })
  }
}