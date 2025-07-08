import { QueryResult } from 'pg'
import { IBook } from '../types/book.types'
import pool from '../config/db'

/**
 * Servicios para lógica de negocio del modelo Books.
 * @module BookServices
 */

/**
 * Obtiene todos los libros desde la base de datos.
 * @returns {Promise<IBook[]>} Lista de libros.
 */
export async function findAllBooks(): Promise<IBook[]> {
  const result: QueryResult<IBook> = await pool.query('SELECT * FROM books')
  return result.rows
}

/**
 * Obtiene un libro por id desde la base de datos.
 * @param {number|string} bookId - Id del libro a buscar.
 * @returns {Promise<IBook | null>} El libro encontrado.
 * @throws {Error} Si no encuentra el libro.
 */
export async function findBookById(bookId: string): Promise<IBook | null> {
  const result: QueryResult<IBook> = await pool.query('SELECT * FROM books WHERE id = $1', [bookId])
  if (result.rows.length <= 0) {
    throw new Error('Book not found')
  }
  return result.rows[0]
}

/**
 * Inserta un nuevo libro en la base de datos.
 * @param {string} title - Título del libro.
 * @param {string} author - Autor del libro.
 * @param {number} year - Año de publicación del libro.
 * @returns {Promise<IBook>} El libro creado.
 */
export async function addBook(title: string, author: string, year: number): Promise<IBook> {
  const result: QueryResult<IBook> = await pool.query(
    'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *',
    [title, author, year]
  )
  return result.rows[0]
}

/**
 * Actualiza la información de un libro por id en la base de datos.
 * @param {number|string} bookId - Id del libro a modificar.
 * @param {string} title - Nuevo título del libro.
 * @param {string} author - Nuevo autor del libro.
 * @param {number} year - Nuevo año del libro.
 * @returns {Promise<IBook>} El libro actualizado.
 * @throws {Error} Si no encuentra el libro.
 */
export async function editBook(bookId: number | string, title: string, author: string, year: number): Promise<IBook> {
  const result: QueryResult<IBook> = await pool.query(
    'UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING *',
    [title, author, year, bookId]
  )
  if (result.rowCount === 0) throw new Error('Book not found')
  return result.rows[0]
}

/**
 * Elimina un libro por id de la base de datos.
 * @param {number|string} bookId - Id del libro a eliminar.
 * @returns {Promise<void>}
 * @throws {Error} Si no encuentra el libro.
 */
export async function removeBook(bookId: number | string): Promise<void> {
  const result: QueryResult = await pool.query(
    'DELETE FROM books WHERE id = $1',
    [bookId]
  )
  if (result.rowCount === 0) throw new Error('Book not found')
}