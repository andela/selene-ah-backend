import { Router } from 'express';
import userAuth from './api/auth/userAuth';

const router = Router();

router.use('/api/v1', userAuth);

export default router;
