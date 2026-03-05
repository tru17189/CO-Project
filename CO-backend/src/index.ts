import express      from 'express'
import cookieParser from 'cookie-parser'
import cors         from 'cors'
import dotenv       from 'dotenv'
import authRoutes   from './routes/auth.routes'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 4000

app.use(cors({
  origin:      process.env.FRONTEND_URL,
  credentials: true,           // allows cookies to be sent
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})