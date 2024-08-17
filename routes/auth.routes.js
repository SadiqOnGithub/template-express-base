import { Router } from 'express'

import { authControllers } from '#controllers'

const router = Router()

router.get('/', authControllers.adminLogin)

export default router
