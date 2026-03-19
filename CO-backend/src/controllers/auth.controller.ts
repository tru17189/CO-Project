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
/*
  Esta funcion tiene el proposito de obtener la informacion del usuario 
  actualmente autenticado, incluyendo su negocio si es que tiene uno. 
  Se hace un LEFT JOIN entre las tablas usuarios y negocios para traer toda 
  la informacion en una sola consulta. Si el usuario no tiene un negocio, 
  los campos del negocio seran null.

  Ir a frontend/src/contexts/AuthContext.tsx para ver como se consume esta 
  funcion en el frontend.
 */
export async function me(req: Request, res: Response) {
  const userId = (req as any).userId

  try {
    const [rows]: any = await pool.query(
      `SELECT 
      u.id, u.primer_nombre, u.segundo_nombre, u.apellidos,
      u.correo, u.telefono, u.genero, u.es_negocio, u.created_at,
      n.id AS negocio_id, n.nombre AS negocio_nombre,
      n.telefono AS negocio_telefono, n.correo AS negocio_correo,
      n.num_empleados, n.plan,
      COUNT(cn.id) AS total_contactos
      FROM usuarios u
      LEFT JOIN negocios n ON n.usuario_id = u.id
      LEFT JOIN contacto_negocios cn ON cn.negocio_id = n.id
      WHERE u.id = ?
      GROUP BY u.id, n.id`,
      [userId]
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    const row = rows[0]
    return res.json({
      user: {
        id:             row.id,
        primer_nombre:  row.primer_nombre,
        segundo_nombre: row.segundo_nombre,
        apellidos:      row.apellidos,
        correo:         row.correo,
        telefono:       row.telefono,
        genero:         row.genero,
        es_negocio:     row.es_negocio,
        created_at:     row.created_at,
          negocio: row.negocio_id ? {
          id:              row.negocio_id,
          nombre:          row.negocio_nombre,
          telefono:        row.negocio_telefono,
          correo:          row.negocio_correo,
          num_empleados:   row.num_empleados,
          plan:            row.plan,
          total_contactos: row.total_contactos,
        } : null
      }
  })

  } catch (error) {
    console.error('Me error:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

// ── Check if Email exist ────────────────────────────────────
/*
 * Esta función verifica si un correo electrónico ya está registrado en la base de datos.
 */
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