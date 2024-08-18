import dotenv from 'dotenv'
dotenv.config()
import { Router } from 'express'

import { authControllers } from '#controllers'

const router = Router()

if (process.env.NODE_ENV === 'development') {
  router.post('/adminRegister', authControllers.adminRegister)
}

router.post('/adminLogin', authControllers.adminLogin)

router.get('/refresh', authControllers.refresh)

export default router
