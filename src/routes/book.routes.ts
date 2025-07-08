import { Router } from 'express'
import { validateSchema } from '../middlewares/schema.middleware'
import { validateId } from '../middlewares/idValidator.middleware'
import { BookSchema } from '../schemas/book.schema'
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/book.controller'

const router = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         year:
 *           type: integer
 *       example:
 *         id: 1
 *         title: "Cien años de soledad"
 *         author: "Gabriel García Márquez"
 *         year: 1967
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BookPayload:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         year:
 *           type: integer
 *       example:
 *         title: "Cien años de soledad"
 *         author: "Gabriel García Márquez"
 *         year: 1967
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Libros que maneja la API
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Obtiene todos los libros
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Lista de libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getBooks)

/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     summary: Obtiene un libro por ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del libro a buscar
 *     responses:
 *       200:
 *         description: Libro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Libro no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:bookId', validateId(), getBookById)

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Crea un nuevo libro
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookPayload'
 *     responses:
 *       201:
 *         description: Libro creado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/',validateSchema(BookSchema), createBook)

/**
 * @swagger
 * /books/{bookId}:
 *   put:
 *     summary: Actualiza un libro por ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del libro a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookPayload'
 *     responses:
 *       200:
 *         description: Libro actualizado
 *       404:
 *         description: Libro no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:bookId', validateId(), validateSchema(BookSchema), updateBook)

/**
 * @swagger
 * /books/{bookId}:
 *   delete:
 *     summary: Elimina un libro por ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del libro a eliminar
 *     responses:
 *       200:
 *         description: Libro eliminado
 *       404:
 *         description: Libro no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:bookId', validateId(), deleteBook)

export default router