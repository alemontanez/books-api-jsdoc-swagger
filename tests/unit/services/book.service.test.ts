import { addBook, editBook, findAllBooks, findBookById, removeBook } from '../../../src/services/book.service'
import pool from '../../../src/config/db'
import { IBook } from '../../../src/types/book.types'
import { QueryResult } from 'pg'

jest.mock('../../../src/config/db')
const mockQuery = pool.query as jest.Mock


describe('Book service unit test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findAllBooks', () => {
    describe('Casos exitosos', () => {
      test('debería retornar un array con todos los libros que existen', async () => {
        const mockBooks: IBook[] = [
          { id: 1, title: 'Clean Code', author: 'Robert Martin', year: 2008 },
          { id: 2, title: 'Refactoring', author: 'Martin Fowler', year: 1999 }
        ]
        const mockQueryResult: QueryResult<IBook> = {
          command: 'SELECT',
          rowCount: mockBooks.length,
          oid: 0,
          fields: [],
          rows: mockBooks
        }
        mockQuery.mockResolvedValue(mockQueryResult)

        const result = await findAllBooks()

        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM books')
        expect(result).toEqual(mockBooks)
        expect(mockQuery).toHaveBeenCalledTimes(1)
      })

      test('debería retornar un array vacío si no hay libros', async () => {
        mockQuery.mockResolvedValue({ rows: [] })

        const result = await findAllBooks()

        expect(result).toEqual([])
        expect(mockQuery).toHaveBeenCalledTimes(1)
      })
    })

    describe('Casos de error', () => {
      test('debería propagar errores inesperados de la DB', async () => {
        mockQuery.mockRejectedValue(new Error('DB error'))

        await expect(findAllBooks()).rejects.toThrow('DB error')

        expect(mockQuery).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('findBookById', () => {
    describe('Casos exitosos', () => {
      test('debería retornar un libro cuando existe', async () => {
        const mockBook: IBook = { id: 1, title: 'Clean Code', author: 'Robert Martin', year: 2008 }
        mockQuery.mockResolvedValue({ rows: [mockBook] })

        const result = await findBookById('1')

        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM books WHERE id = $1', ['1'])
        expect(result).toEqual(mockBook)
        expect(mockQuery).toHaveBeenCalledTimes(1)
      })
    })

    describe('Casos de error', () => {
      test('debería lanzar error si no se encuentra el libro', async () => {
        mockQuery.mockResolvedValue({ rows: [] })

        await expect(findBookById('9999')).rejects.toThrow('Book not found')
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM books WHERE id = $1', ['9999'])
        expect(mockQuery).toHaveBeenCalledTimes(1)
      })

      test('debería propagar errores inesperados de la DB', async () => {
        mockQuery.mockRejectedValue(new Error('DB error'))

        await expect(findAllBooks()).rejects.toThrow('DB error')

        expect(mockQuery).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('addBook', () => {
    describe('Casos exitosos', () => {
      test('debería insertar un libro en la base de datos y devolverlo', async () => {
        const mockBook: IBook = { id: 1, title: 'Clean Code', author: 'Robert Martin', year: 2008 }
        mockQuery.mockResolvedValue({ rows: [mockBook] })

        const result = await addBook(mockBook.title, mockBook.author, mockBook.year)

        expect(mockQuery).toHaveBeenCalledWith(
          'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *',
          [mockBook.title, mockBook.author, mockBook.year]
        )
        expect(result).toEqual(mockBook)
        expect(mockQuery).toHaveBeenCalledTimes(1)
      })
    })

    describe('Casos de error', () => {
      test('debería propagar el error si la consulta sql falla', async () => {
        mockQuery.mockRejectedValue(new Error('DB error'))

        await expect(addBook('Libro 1', 'Autor 1', 2026)).rejects.toThrow('DB error')

        expect(mockQuery).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('editBook', () => {
    describe('Casos exitosos', () => {
      test('debería actualizar un libro en la base de datos y devolverlo', async () => {
        const mockBook: IBook = { id: 1, title: 'New Book', author: 'New Author', year: 2025 }
        mockQuery.mockResolvedValue({ rows: [mockBook] })

        const result = await editBook(mockBook.id, mockBook.title, mockBook.author, mockBook.year)

        expect(mockQuery).toHaveBeenCalledWith(
          'UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING *',
          [mockBook.title, mockBook.author, mockBook.year, 1]
        )
        expect(result).toEqual(mockBook)
        expect(mockQuery).toHaveBeenCalledTimes(1)
      })
    })

    describe('Casos de error', () => {
      test('debería lanzar error si no encuentra el libro', async () => {
        mockQuery.mockResolvedValue({
          rows: [],
          rowCount: 0
        })

        await expect(editBook(1, 'Libro 1', 'Autor 1', 2026)).rejects.toThrow('Book not found')

        expect(mockQuery).toHaveBeenCalledTimes(1)
      })

      test('debería propagar el error si la consulta sql falla', async () => {
        mockQuery.mockRejectedValue(new Error('DB error'))

        await expect(editBook(1, 'Libro 1', 'Autor 1', 2026)).rejects.toThrow('DB error')

        expect(mockQuery).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('removeBook', () => {
    describe('Casos exitosos', () => {
      test('debería eliminar un libro de la base de datos', async () => {
        mockQuery.mockResolvedValue({ rowCount: 1 } as QueryResult)

        await expect(removeBook(1)).resolves.toBeUndefined()

        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM books WHERE id = $1', [1])
        expect(mockQuery).toHaveBeenCalledTimes(1)
      })
    })

    describe('Casos de error', () => {
      test('debería lanzar error si no encuentra el libro', async () => {
        mockQuery.mockResolvedValue({ rowCount: 0 } as QueryResult)

        await expect(removeBook(9999)).rejects.toThrow('Book not found')

        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM books WHERE id = $1', [9999])
        expect(mockQuery).toHaveBeenCalledTimes(1)
      })

      test('debería propagar el error si la consulta sql falla', async () => {
        mockQuery.mockRejectedValue(new Error('DB error'))

        await expect(removeBook(9999)).rejects.toThrow('DB error')

        expect(mockQuery).toHaveBeenCalledTimes(1)
      })
    })
  })


})