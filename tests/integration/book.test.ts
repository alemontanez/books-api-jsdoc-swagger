import app from '../../src/app'
import db from '../../src/config/db'
import request from 'supertest'

// Tests para ruta GET /books
describe('GET /api/books', () => {
  test('debería devolver status 200 y un array', async () => {
    const res = await request(app).get('/api/books')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

// Tests para ruta GET /books/:bookId
describe('GET /api/books/:bookId', () => {
  let insertedBookId: number | string

  beforeEach(async () => {
    const result = await db.query(
      'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id',
      ['Test Book', 'Test Author', 2025]
    )
    insertedBookId = result.rows[0].id
  })

  afterEach(async () => {
    await db.query(
      'DELETE FROM books'
    )
  })

  test('debería devolver status 200 y un libro si el ID existe', async () => {
    const res = await request(app).get(`/api/books/${insertedBookId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('id', insertedBookId)
    expect(res.body).toHaveProperty('title', 'Test Book')
  })

  test('debería devolver status 404 si el libro no existe', async () => {
    const res = await request(app).get('/api/books/-1')
    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty('error', 'Book not found')
  })
})

// Tests para ruta POST /books
describe('POST /api/books', () => {
  test('debería crear un nuevo libro y devolver status 201', async () => {
    const newBook = {
      title: 'Nuevo libro',
      author: 'Autor nuevo',
      year: 2025
    }

    const res = await request(app)
      .post('/api/books')
      .send(newBook)
      .set('Content-Type', 'application/json')

    expect(res.statusCode).toBe(201)
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data.title).toBe(newBook.title)
    expect(res.body.data.author).toBe(newBook.author)
    expect(res.body.data.year).toBe(newBook.year)

    const dbCheck = await db.query(
      'SELECT * FROM books WHERE id = $1',
      [res.body.data.id]
    )
    expect(dbCheck.rows.length).toBe(1)
    expect(dbCheck.rows[0].title).toBe(newBook.title)
  })

  // Validaciones de datos
  test('debería devolver status 400 si falta el título', async () => {
    const newBook = {
      author: 'Autor nuevo',
      year: 2025
    }

    const res = await request(app)
      .post('/api/books')
      .send(newBook)
      .set('Content-Type', 'application/json')

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error', ['Title is required'])
  })

  test('debería devolver status 400 si el año es negativo', async () => {
    const newBook = {
      title: 'Libro nuevo',
      author: 'Autor nuevo',
      year: -100
    }

    const res = await request(app)
      .post('/api/books')
      .send(newBook)
      .set('Content-Type', 'application/json')

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error', ['Year must be a positive integer'])
  })
})

// Tests para ruta PUT /books/:bookId
describe('PUT /api/books/:bookId', () => {
  let bookId: number | string

  beforeEach(async () => {
    const result = await db.query(
      'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id',
      ['Original', 'Autor original', 2020]
    )
    bookId = result.rows[0].id
  })

  afterEach(async () => {
    await db.query('DELETE FROM books')
  })

  test('debería actualizar un libro y devolver status 200', async () => {
    const updatedData = {
      title: 'Actualizado',
      author: 'Autor actualizado',
      year: 2025
    }

    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .send(updatedData)
      .set('Content-Type', 'application/json')

    expect(res.statusCode).toBe(200)
    expect(res.body.data.title).toBe(updatedData.title)
    expect(res.body.data.author).toBe(updatedData.author)
    expect(res.body.data.year).toBe(updatedData.year)

    const checkDb = await db.query(
      'SELECT * FROM books WHERE id = $1',
      [bookId]
    )
    expect(checkDb.rows[0].title).toBe(updatedData.title)
  })

    // Validaciones de datos
  test('debería devolver status 400 si falta el título', async () => {
    const updatedBook = {
      author: 'Autor actualizado',
      year: 2025
    }

    const res = await request(app)
      .post('/api/books')
      .send(updatedBook)
      .set('Content-Type', 'application/json')

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error', ['Title is required'])
  })

  test('debería devolver status 400 si el año es negativo', async () => {
    const updatedBook = {
      title: 'Libro actualizado',
      author: 'Autor actualizado',
      year: -100
    }

    const res = await request(app)
      .post('/api/books')
      .send(updatedBook)
      .set('Content-Type', 'application/json')

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error', ['Year must be a positive integer'])
  })

  test('debería devolver status 404 si el libro no existe', async () => {
    const updatedData = {
      title: 'Actualizado',
      author: 'Autor actualizado',
      year: 2025
    }

    const res = await request(app)
      .put('/api/books/-1')
      .send(updatedData)
      .set('Content-Type', 'application/json')

    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty('error', 'Book not found')
  })
})

// Tests para ruta DELETE /books/:bookId
describe('DELETE /api/books/bookId', () => {
  let bookId: number

  beforeEach(async () => {
    const result = await db.query(
      'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id',
      ['Libro a eliminar', 'Autor desconocido', 2018]
    )
    bookId = result.rows[0].id
  })

  afterEach(async () => {
    await db.query('DELETE FROM books')
  })

  test('debería eliminar un libro y devolver status 200', async () => {
    const res = await request(app).delete(`/api/books/${bookId}`)
    expect(res.statusCode).toBe(200)

    const checkDb = await db.query('SELECT * FROM books WHERE id = $1', [bookId])
    expect(checkDb.rows.length).toBe(0)
  })

  test('debería devolver status 404 si el libro no existe', async () => {
    const res = await request(app).delete('/api/books/-1')
    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty('error', 'Book not found')
  })
})


afterAll(async () => {
  await db.end()
})