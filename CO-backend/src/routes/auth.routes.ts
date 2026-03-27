import { Router }                           from 'express'
import { 
register, login, logout, me, emailExist, businessClients, registerNewContact, getNegocioById,
incrementEnlace
} from '../controllers/auth.controller'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/register/new-contact', registerNewContact)
router.post('/login',    login)
router.post('/logout',   logout)
router.get ('/me',       requireAuth, me)   // protected route
router.get('/negocio/:id', getNegocioById)
router.post('/check-email', emailExist)
router.post('/show-business-clients', requireAuth, businessClients)
router.post('/negocio/:id/nuevo-enlace', requireAuth, incrementEnlace)

export default router