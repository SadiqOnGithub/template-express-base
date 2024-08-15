import express from 'express';

import { rootRouter } from '#routes';

const app = express();

app.get('/', rootRouter)

export default app;