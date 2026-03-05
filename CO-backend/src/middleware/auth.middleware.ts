import { Request, Response, NextFunction } from 'express'
import jwt                                  from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ message: 'No autorizado — inicia sesión' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; correo: string }
    ;(req as any).userId = decoded.id
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}