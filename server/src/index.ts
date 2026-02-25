import 'reflect-metadata'
import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { AppDataSource } from './lib/dataSource'
import { RegisterRoutes } from './generated/routes'
import { errorHandler } from './middleware/errorHandler'

const PORT = parseInt(process.env.PORT ?? '3001', 10)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'

const app = express()

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json())

// Mount tsoa-generated routes
RegisterRoutes(app)

// Global error handler — must be last
app.use(errorHandler)

async function start() {
  await AppDataSource.initialize()
  console.log('Database connected')

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`API docs at  http://localhost:${PORT}/api-docs`)
  })
}

start().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
