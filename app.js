import express from 'express';
import cors from 'cors';

import { corsOptions } from '#cors';
import { rootRouter } from '#routes';

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', rootRouter);

export default app;
