import app from './app.js'
import { PORT } from './config/config.js'

app.listen(PORT)
console.log(`Server running on port ${PORT}`)
console.log('Documentation in http://localhost:3000/docs & http://localhost:3000/api-docs')