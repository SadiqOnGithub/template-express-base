import { Router } from 'express'

import { authControllers } from '#controllers'

const router = Router()

router.get('/', authControllers.adminLogin)

router.get('/refresh', authControllers.refresh)

export default router
