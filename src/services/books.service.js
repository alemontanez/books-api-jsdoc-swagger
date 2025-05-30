import pool from '../config/db.js'

/**
 * Servicios para lógica de negocio del modelo Books.
 * @module BooksService
 */

/**
 * Obtiene todos los libros desde la base de datos.
 * @function findAllBooks
 * @returns {Promise<Array>} Lista de libros.
 */
export async function findAllBooks() {
  const result = await pool.query('SELECT * FROM books')
  return result.rows
}

/**
 * Obtiene un libro por id desde la base de datos.
 * @param {number|string} bookId - Id del libro a buscar.
 * @returns {Promise<Object>} El libro encontrado.
 * @throws {Error} Si no encuentra el libro.
 */
export async function findBookById(bookId) {
  const result = await pool.query('SELECT * FROM books WHERE id = $1', [bookId])
  if (result.rows.length <= 0) {
    throw new Error('Book not found')
  }
  return result.rows
}

/**
 * Inserta un nuevo libro en la base de datos.
 * @param {string} title - Título del libro.
 * @param {string} author - Autor del libro.
 * @param {number|string} year - Año de publicación del libro.
 */
export async function addBook(title, author, year) {
  await pool.query(
    'INSERT INTO books (title, author, year) VALUES ($1, $2, $3)',
    [title, author, year]
  )
}

/**
 * Actualiza la información de un libro por id en la base de datos.
 * @param {number|string} bookId - Id del libro a modificar.
 * @param {string} title - Nuevo título del libro.
 * @param {string} author - Nuevo autor del libro.
 * @param {number|string} year - Nuevo año del libro.
 * @throws {Error} Si no encuentra el libro.
 */
export async function editBook(bookId, title, author, year) {
  const result = await pool.query(
    'SELECT * FROM books WHERE id = $1',
    [bookId]
  )
  if (result.rows.length <= 0) throw new Error('Book not found')
  await pool.query(
    'UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4',
    [title, author, year, bookId]
  )
}

/**
 * Elimina un libro por id de la base de datos.
 * @param {number|string} bookId - Id del libro a eliminar.
 * @throws {Error} Si no encuentra el libro.
 */
export async function removeBook(bookId) {
  const result = await pool.query(
    'SELECT * FROM books WHERE id = $1',
    [bookId]
  )
  if (result.rows.length <= 0) throw new Error('Book not found')
  await pool.query(
    'DELETE FROM books WHERE id = $1',
    [bookId]
  )
}