import { Router }                           from 'express'
import { register, login, logout, me, emailExist, businessClients }      from '../controllers/auth.controller'
import { requireAuth }                      from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login',    login)
router.post('/logout',   logout)
router.get ('/me',       requireAuth, me)   // protected route
router.post('/check-email', emailExist)
router.post('/show-business-clients', requireAuth, businessClients)

export default router