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

// ── Register a new contact ────────────────────────────────────────────────
export async function registerNewContact(req: Request, res: Response) {
  const {
    primer_nombre, segundo_nombre, apellidos,
    correo, telefono, password, genero, negocio_id, platforma
  } = req.body

  if (!primer_nombre || !apellidos || !correo || !telefono || !password || !negocio_id) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' })
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

    const hashedPassword = await bcrypt.hash(password, 12)

    await connection.beginTransaction()

    // Insert into usuarios (es_negocio = 0)
    const [userResult]: any = await connection.query(
      `INSERT INTO usuarios
        (primer_nombre, segundo_nombre, apellidos, genero, correo, telefono, password, es_negocio)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [primer_nombre, segundo_nombre || null, apellidos, genero || null, correo, telefono, hashedPassword]
    )

    const userId = userResult.insertId

    // Insert into contactos
    const [contactResult]: any = await connection.query(
      `INSERT INTO contactos (usuario_id, plataforma, es_comprador)
       VALUES (?, ?, 0)`,
      [userId, platforma]
    )

    const contactId = contactResult.insertId

    // Link contact to the business
    await connection.query(
      `INSERT INTO contacto_negocios (contacto_id, negocio_id)
       VALUES (?, ?)`,
      [contactId, negocio_id]
    )

    await connection.commit()

    return res.status(201).json({ message: 'Contacto registrado exitosamente' })

  } catch (error) {
    await connection.rollback()
    console.error('registerContact error:', error)
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
      n.enlaces_enviados,
      COUNT(cn.id) AS total_contactos,
      SUM(c.es_comprador=1) AS total_compradores
      FROM usuarios u
      LEFT JOIN negocios n ON n.usuario_id = u.id
      LEFT JOIN contacto_negocios cn ON cn.negocio_id = n.id
      LEFT JOIN contactos c ON c.id = cn.contacto_id
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
          total_compradores: row.total_compradores,
          enlaces_enviados: row.enlaces_enviados
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

// ── Users related to a business ─────────────────────────────
export async function businessClients(req: Request, res: Response) {
  const userId = (req as any).userId

  try {
    // Resolve negocio_id from the authenticated user
    const [negocioRows]: any = await pool.query(
      'SELECT id FROM negocios WHERE usuario_id = ?',
      [userId]
    )
    if (negocioRows.length === 0) {
      return res.status(404).json({ message: 'No se encontró un negocio para este usuario' })
    }
    const negocioId = negocioRows[0].id

    const [rows]: any = await pool.query(`
      select cn.contacto_id, 
      cn.negocio_id, 
      u.primer_nombre, 
      u.apellidos,
      u.es_negocio,
      u.telefono,
      c.plataforma 
      from contacto_negocios cn 
      inner join contactos c 
      on cn.contacto_id = c.id
      inner join usuarios u 
      on c.usuario_id = u.id 
      where cn.negocio_id = ?`,
      [negocioId]
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sin clientes ingresados' })
    }
    return res.json({
      contactos_negocio: rows.map((row: any) => ({
        contacto_id: row.contacto_id,
        negocio_id: row.negocio_id,
        primer_nombre: row.primer_nombre,
        apellidos: row.apellidos,
        es_negocio: row.es_negocio,
        telefono: row.telefono,
        plataforma: row.plataforma
      }))
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

// ── Login ────────────────────────────────────────────────────
export async function getNegocioById(req: Request, res: Response) {
  const { id } = req.params

  try {
    const [rows]: any = await pool.query(
      `SELECT n.id, n.nombre, u.primer_nombre, u.apellidos
       FROM negocios n
       JOIN usuarios u ON u.id = n.usuario_id
       WHERE n.id = ?`,
      [id]
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Negocio no encontrado' })
    }
    return res.json({ negocio: rows[0] })
  } catch (error) {
    console.error('getNegocioById error:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

// ── Number of successful sent links ────────────────────────────────────
export async function incrementEnlace(req: Request, res: Response) {
  const { id } = req.params

  try {
    await pool.query(
      `UPDATE negocios SET enlaces_enviados = enlaces_enviados + 1 WHERE id = ?`,
      [id]
    )
    const [rows]: any = await pool.query(
      `SELECT enlaces_enviados FROM negocios WHERE id = ?`,
      [id]
    )
    return res.json({ enlaces_enviados: rows[0].enlaces_enviados })
  } catch (error) {
    console.error('incrementEnlace error:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}