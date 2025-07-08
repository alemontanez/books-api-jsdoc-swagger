import { Response, Request } from 'express'
import { IBook, IBookPayload } from '../types/book.types'
import {
  addBook,
  editBook,
  findAllBooks,
  findBookById,
  removeBook
} from '../services/book.service'


/**
 * Controladores del modelo Books
 * @module BookControllers
 */

/**
 * Controlador para obtener todos los libros.
 * @param {Request} _req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Respuesta con la lista de libros.
 */
export async function getBooks(_req: Request, res: Response): Promise<void> {
  try {
    const books = await findAllBooks()
    res.json(books)
    return
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

/**
 * Controlador para obtener un libro por id.
 * @param {Request} req - Objeto de solicitud HTTP con bookId como parámetro.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Respuesta con el libro encontrado o un error
 */
export async function getBookById(req: Request, res: Response): Promise<void> {
  const { bookId } = req.params
  try {
    const book = await findBookById(bookId)
    res.json(book)
    return
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      if (error.message === 'Book not found') {
        res.status(404).json({ error: error.message })
        return
      }
    }
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

/**
 * Controlador para crear un nuevo libro.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Respuesta con mensaje y datos del libro creado o un error.
 */
export async function createBook(req: Request<unknown, unknown, IBookPayload>, res: Response): Promise<void> {
  const { title, author, year } = req.body
  try {
    const book: IBook = await addBook(title, author, year)
    res.status(201).json({
      message: 'Book added successfully',
      data: book
    })
    return
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

/**
 * Controlador para actualizar un libro por id.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Respuesta con mensaje y datos del libro modificado o un error.
 */
export async function updateBook(req: Request<{ bookId: string }, unknown, IBookPayload>, res: Response): Promise<void> {
  const { bookId } = req.params
  const { title, author, year } = req.body
  try {
    const book: IBook = await editBook(bookId, title, author, year)
    res.status(200).json({
      message: 'Book updated successfully',
      data: book
    })
    return
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      if (error.message === 'Book not found') {
        res.status(404).json({ error: error.message })
        return
      }
    }
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}

/**
 * Controlador para eliminar un libro por id.
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>}
 */
export async function deleteBook(req: Request, res: Response): Promise<void> {
  const { bookId } = req.params
  try {
    await removeBook(bookId)
    res.status(200).json({ message: 'Book deleted successfully' })
    return
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      if (error.message === 'Book not found') {
        res.status(404).json({ error: error.message })
        return
      }
    }
    res.status(500).json({ error: 'Internal server error' })
    return
  }
}