import { Router }                           from 'express'
import { register, login, logout, me, emailExist }      from '../controllers/auth.controller'
import { requireAuth }                      from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login',    login)
router.post('/logout',   logout)
router.get ('/me',       requireAuth, me)   // protected route
router.post('/check-email', emailExist)

export default router