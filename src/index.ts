import app from './app'
import { PORT } from './config/config'

app.listen(PORT)
console.log(`Server running on port ${PORT}`)
console.log('API documentation in http://localhost:3000/api-docs')