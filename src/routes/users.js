import { Router } from 'express'
import controller from '../controllers/users.js'
import token from '../middleware/token.js'

const router = Router()
router.get('/',token,controller.GET)
router.get('/:me',token,controller.GET)

export default router;