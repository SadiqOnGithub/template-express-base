import { Router } from "express";

const router = Router();

router.all('/', (req, res) => {
  res.send('api is working');
});

export default router ;