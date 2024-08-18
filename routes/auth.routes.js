import dotenv from 'dotenv'
dotenv.config()
import { Router } from 'express'

import { authControllers } from '#controllers'
import { authMiddleware } from '#middlewares'

const router = Router()

if (process.env.NODE_ENV === 'development') {
  router.post('/adminRegister', authControllers.adminRegister)
}

router.post('/adminLogin', authControllers.adminLogin)

router.get('/refresh', authControllers.refresh)

router.get('/adminLogout', authControllers.adminLogout)

router.get('/current-admin', authMiddleware, authControllers.getCurrentAdmin)

export default router
