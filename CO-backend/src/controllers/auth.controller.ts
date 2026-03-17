import { Request, Response } from 'express'
import bcrypt                from 'bcryptjs'
import jwt                   from 'jsonwebtoken'
import pool                  from '../config/db'

const JWT_SECRET  = process.env.JWT_SECRET  as string
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d'

const cookieOptions = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',  // HTTPS only in prod
  sameSite: 'lax'  as const,
  maxAge:   7 * 24 * 60 * 60 * 1000,               // 7 days in ms
}

// ── Register ────────────────────────────────────────────────
export async function register(req: Request, res: Response) {
  const {
    // Step 1 — personal info
    primer_nombre, segundo_nombre, apellidos,
    correo, telefono, password, genero,
    // Step 2 — business info
    nombre_negocio, telefono_negocio,
    correo_negocio, num_empleados, plan
  } = req.body

  // Validate required fields
  if (!primer_nombre || !apellidos || !correo || !telefono || !password || !genero) {
    return res.status(400).json({ message: 'Todos los campos personales son requeridos' })
  }
  if (!nombre_negocio || !telefono_negocio || !correo_negocio || !plan) {
    return res.status(400).json({ message: 'Todos los campos del negocio son requeridos' })
  }

  const connection = await pool.getConnection()

  try {
    // Check if correo already exists
    const [existing]: any = await connection.query(
      'SELECT id FROM usuarios WHERE correo = ?', [correo]
    )
    if (existing.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Start transaction — both inserts must succeed or both fail
    await connection.beginTransaction()

    // Insert into usuarios
    const [userResult]: any = await connection.query(
      `INSERT INTO usuarios
        (primer_nombre, segundo_nombre, apellidos, genero, correo, telefono, password, es_negocio)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [primer_nombre, segundo_nombre || null, apellidos, genero, correo, telefono, hashedPassword]
    )

    const userId = userResult.insertId

    // Insert into negocios
    await connection.query(
      `INSERT INTO negocios
        (usuario_id, nombre, telefono, correo, num_empleados, plan)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, nombre_negocio, telefono_negocio, correo_negocio, num_empleados || null, plan]
    )

    // Commit transaction
    await connection.commit()

    return res.status(201).json({
      message: 'Cuenta creada exitosamente'
    })

  } catch (error) {
    // Roll back if anything failed
    await connection.rollback()
    console.error('Register error:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  } finally {
    connection.release()
  }
}

// ── Login ────────────────────────────────────────────────────
export async function login(req: Request, res: Response) {
  const { correo, password } = req.body

  console.log('1. Body received:', req.body)

  if (!correo || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' })
  }

  try {
    // Find user
    const [rows]: any = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ?', [correo]
    )
    console.log('2. User found in DB:', rows.length > 0 ? rows[0].correo : 'NOT FOUND')
    console.log('3. Password in DB:', rows[0]?.password)
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const user = rows[0]

    // Compare password
    const isValid = await bcrypt.compare(password, user.password)
    console.log('4. Password valid:', isValid)
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // Sign JWT
    const token = jwt.sign(
        { id: user.id, correo: user.correo } as object,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES } as jwt.SignOptions
    )

    res.cookie('token', token, cookieOptions)
    return res.json({
      message: 'Sesión iniciada',
      user: {
        id:            user.id,
        primer_nombre: user.primer_nombre,
        apellidos:     user.apellidos,
        correo:         user.correo,
        es_negocio:    user.es_negocio,
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

// ── Logout ───────────────────────────────────────────────────
export async function logout(_req: Request, res: Response) {
  res.clearCookie('token', cookieOptions)
  return res.json({ message: 'Sesión cerrada' })
}

// ── Me (get current user) ────────────────────────────────────
export async function me(req: Request, res: Response) {
  const userId = (req as any).userId

  try {
    const [rows]: any = await pool.query(
      'SELECT id, primer_nombre, segundo_nombre, apellidos, correo, telefono, es_negocio, created_at FROM usuarios WHERE id = ?',
      [userId]
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    return res.json({ user: rows[0] })

  } catch (error) {
    console.error('Me error:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

// ── Check if Email exist ────────────────────────────────────
export async function emailExist(req: Request, res: Response) {
  const { correo } = req.body

  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    )
    if (rows.length > 0) {
      return res.status(409).json({ message: 'El correo ya está en uso' })
    } else {
      return res.json({ message: 'El correo está disponible' })
    }
  } catch (error) {
    console.error(`Email exist error: ${error}`)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}