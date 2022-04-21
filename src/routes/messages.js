import { Router } from 'express'
import token from '../middleware/token.js'
import controller from '../controllers/messages.js'

const router = Router()
router.get('/', token, controller.GET)
router.post('/', token, controller.POST)

export default router;