import { Router } from 'express'
import controller from '../controllers/auth.js'
import validator from '../middleware/validation.js'

const router = Router()
router.post('/login', validator.loginValid, controller.LOGIN)
router.post('/register', validator.registerValid, controller.REGISTER)


export default router;