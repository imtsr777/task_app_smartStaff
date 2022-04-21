import { Router } from 'express'
import tokenValid from '../middleware/tokenValid.js'
import controller from '../controllers/tokenValid.js'

const router = Router()
router.get('/',tokenValid,controller.TOKEN_VALID)

export default router;