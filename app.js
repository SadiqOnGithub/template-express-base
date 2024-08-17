import express from 'express'
import cors from 'cors'

import { corsOptions } from '#cors'
import { authRouter, rootRouter } from '#routes'

const app = express()

// Middlewares
app.use(cors(corsOptions))
app.use(express.json())

app.use('/', rootRouter)
app.use('/auth', authRouter)

export default app
