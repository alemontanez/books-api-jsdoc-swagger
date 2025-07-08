import { Request, Response } from 'express'
import { createBook, deleteBook, getBookById, getBooks, updateBook } from '../../../src/controllers/book.controller'
import { addBook, editBook, findAllBooks, findBookById, removeBook } from '../../../src/services/book.service'
import { IBookPayload } from '../../../src/types/book.types'

// Mock del service
jest.mock('../../../src/services/book.service')

const mockFindAllBooks = findAllBooks as jest.MockedFunction<typeof findAllBooks>
const mockFindBookById = findBookById as jest.MockedFunction<typeof findBookById>
const mockAddBook = addBook as jest.MockedFunction<typeof addBook>
const mockEditBook = editBook as jest.MockedFunction<typeof editBook>
const mockRemoveBook = removeBook as jest.MockedFunction<typeof removeBook>

// Mock de console.error para evitar logs en tests
jest.spyOn(console, 'error').mockImplementation(() => { })

describe('Book controller unit tests', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockJson: jest.Mock
  let mockStatus: jest.Mock

  beforeEach(() => {
    // Setup de mocks para cada test
    mockJson = jest.fn()
    mockStatus = jest.fn().mockReturnThis() // Para poder hacer res.status().json()

    mockReq = {}
    mockRes = {
      json: mockJson,
      status: mockStatus
    }

    // Limpiar mocks entre tests
    jest.clearAllMocks()
  })

  describe('getBooks', () => {
    describe('Casos exitosos', () => {
      test('debería retornar status 200 y una lista de libros cuando hay libros', async () => {
        // Arrange - Preparar datos de prueba
        const mockBooks = [
          { id: 1, title: 'Libro 1', author: 'Autor 1', year: 2023 },
          { id: 2, title: 'Libro 2', author: 'Autor 2', year: 2024 }
        ]
        mockFindAllBooks.mockResolvedValue(mockBooks)

        // Act - Ejecutar la función
        await getBooks(mockReq as Request, mockRes as Response)

        // Assert - Verificar resultados
        expect(mockFindAllBooks).toHaveBeenCalledTimes(1)
        expect(mockJson).toHaveBeenCalledWith(mockBooks)
        expect(mockStatus).not.toHaveBeenCalled() // No debería llamar status en caso exitoso
      })

      test('debería retornar status 200 y un array vacío cuando no hay libros', async () => {
        // Arrange
        const emptyBooks: any[] = []
        mockFindAllBooks.mockResolvedValue(emptyBooks)

        // Act
        await getBooks(mockReq as Request, mockRes as Response)

        // Assert
        expect(mockFindAllBooks).toHaveBeenCalledTimes(1)
        expect(mockJson).toHaveBeenCalledWith(emptyBooks)
        expect(mockStatus).not.toHaveBeenCalled()
      })
    })

    describe('Casos de error', () => {
      test('debería retornar status 500 cuando el service falla', async () => {
        // Arrange
        const errorMessage = 'Database connection failed'
        mockFindAllBooks.mockRejectedValue(new Error(errorMessage))

        // Act
        await getBooks(mockReq as Request, mockRes as Response)

        // Assert
        expect(mockFindAllBooks).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' })
        expect(console.error).toHaveBeenCalledWith(new Error(errorMessage))
      })

      test('debería retornar status 500 cuando el service arroja un error genérico', async () => {
        // Arrange
        mockFindAllBooks.mockRejectedValue('Something went wrong')

        // Act
        await getBooks(mockReq as Request, mockRes as Response)

        // Assert
        expect(mockFindAllBooks).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' })
        expect(console.error).toHaveBeenCalledWith('Something went wrong')
      })
    })
  })

  describe('getBookById', () => {
    describe('Casos exitosos', () => {
      test('debería retornar status 200 y el libro cuando existe', async () => {
        // Arrange
        const bookId = '1'
        const mockBook = { id: 1, title: 'Libro 1', author: 'Autor 1', year: 2025 }
        mockReq.params = { bookId }
        mockFindBookById.mockResolvedValue(mockBook)

        // Act
        await getBookById(mockReq as Request, mockRes as Response)

        // Assert
        expect(mockFindBookById).toHaveBeenCalledTimes(1)
        expect(mockFindBookById).toHaveBeenCalledWith(bookId)
        expect(mockJson).toHaveBeenCalledWith(mockBook)
        expect(mockStatus).not.toHaveBeenCalled()
      })
    })

    describe('Casos de error', () => {
      test('debería retornar status 404 cuando el libro no existe', async () => {
        // Arrange
        const bookId = '9999'
        mockReq.params = { bookId }
        mockFindBookById.mockRejectedValue(new Error('Book not found'))

        // Act
        await getBookById(mockReq as Request, mockRes as Response)

        // Assert
        expect(mockFindBookById).toHaveBeenCalledTimes(1)
        expect(mockFindBookById).toHaveBeenLastCalledWith(bookId)
        expect(mockStatus).toHaveBeenCalledWith(404)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Book not found' })
      })

      test('debería retornar status 500 cuando el servicio falla', async () => {
        // Arrange
        const bookId = '1'
        mockReq.params = { bookId }
        mockFindBookById.mockRejectedValue(new Error('Database connection failed'))

        // Act
        await getBookById(mockReq as Request, mockRes as Response)

        // Assert
        expect(mockFindBookById).toHaveBeenCalledTimes(1)
        expect(mockFindBookById).toHaveBeenCalledWith(bookId)
        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' })
      })
    })
  })

  describe('createBook', () => {
    describe('Casos exitosos', () => {
      test('debería retornar status 201 y crear un libro', async () => {
        const mockBook = { id: 1, title: 'Libro nuevo', author: 'Autor nuevo', year: 2004 }
        mockAddBook.mockResolvedValue(mockBook)
        mockReq = {
          body: {
            title: 'Libro nuevo',
            author: 'Autor nuevo',
            year: 2004
          }
        }

        await createBook(mockReq as Request, mockRes as Response)

        expect(mockAddBook).toHaveBeenCalledTimes(1)
        expect(mockAddBook).toHaveBeenCalledWith(mockBook.title, mockBook.author, mockBook.year)
        expect(mockStatus).toHaveBeenCalledWith(201)
        expect(mockJson).toHaveBeenCalledWith({
          message: 'Book added successfully',
          data: mockBook
        })
      })
    })

    describe('Casos de error', () => {
      test('debería retornar status 500 cuando el servicio falla', async () => {
        const errorMessage = 'Database connection failed'
        mockAddBook.mockRejectedValue(new Error(errorMessage))
        mockReq = {
          body: {
            title: 'Libro nuevo',
            author: 'Autor nuevo',
            year: 2004
          }
        }

        await createBook(mockReq as Request, mockRes as Response)

        expect(mockAddBook).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' })
      })
    })
  })

  describe('updateBook', () => {
    describe('Casos exitosos', () => {
      test('debería retornar status 200 y actualizar un libro', async () => {
        const bookId = '1'
        const mockBook = { id: 1, title: 'Libro nuevo', author: 'Autor nuevo', year: 2025 }
        mockReq = {
          params: { bookId },
          body: {
            title: 'Libro nuevo',
            author: 'Autor nuevo',
            year: 2025
          }
        }
        mockEditBook.mockResolvedValue(mockBook)

        await updateBook(mockReq as Request<{ bookId: string }, unknown, IBookPayload>, mockRes as Response)

        expect(mockEditBook).toHaveBeenCalledTimes(1)
        expect(mockEditBook).toHaveBeenCalledWith("1", 'Libro nuevo', 'Autor nuevo', 2025)
        expect(mockStatus).toHaveBeenCalledWith(200)
        expect(mockJson).toHaveBeenCalledWith({
          message: 'Book updated successfully',
          data: mockBook
        })
      })
    })

    describe('Casos de error', () => {
      test('debería retornar status 404 cuando el libro no existe', async () => {
        const bookId = '1'
        mockReq = {
          params: { bookId },
          body: {
            title: 'Libro nuevo',
            author: 'Autor nuevo',
            year: 2025
          }
        }
        mockEditBook.mockRejectedValue(new Error('Book not found'))

        await updateBook(mockReq as Request<{ bookId: string }, unknown, IBookPayload>, mockRes as Response)

        expect(mockEditBook).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(404)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Book not found' })
      })

      test('debería retornar status 500 cuando el servicio falla', async () => {
        const bookId = '1'
        mockReq = {
          params: { bookId },
          body: {
            title: 'Libro nuevo',
            author: 'Autor nuevo',
            year: 2025
          }
        }
        mockEditBook.mockRejectedValue(new Error('Database connection failed'))

        await updateBook(mockReq as Request<{ bookId: string }, unknown, IBookPayload>, mockRes as Response)

        expect(mockEditBook).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' })
      })
    })
  })

  describe('deleteBook', () => {
    describe('Casos de éxito', () => {
      test('debería retornar status 200 cuando la eliminación es exitosa', async () => {
        const bookId = '2'
        mockReq = {
          params: { bookId }
        }
        mockRemoveBook.mockResolvedValue()

        await deleteBook(mockReq as Request, mockRes as Response)

        expect(mockRemoveBook).toHaveBeenCalledTimes(1)
        expect(mockRemoveBook).toHaveBeenCalled()
        expect(mockStatus).toHaveBeenCalledWith(200)
        expect(mockJson).toHaveBeenCalledWith({ message: 'Book deleted successfully' })
      })

    })

    describe('Casos de error', () => {
      test('debería retornar status 404 cuando el libro no existe', async () => {
        const bookId = '2'
        mockReq = {
          params: { bookId }
        }
        mockRemoveBook.mockRejectedValue(new Error('Book not found'))

        await deleteBook(mockReq as Request, mockRes as Response)

        expect(mockRemoveBook).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(404)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Book not found' })
      })

      test('debería retornar status 500 cuando el servicio falla', async () => {
        const bookId = '2'
        mockReq = {
          params: { bookId }
        }
        mockRemoveBook.mockRejectedValue(new Error('Database connection failed'))

        await deleteBook(mockReq as Request, mockRes as Response)

        expect(mockRemoveBook).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(500)
        expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' })
      })
    })
  })
})