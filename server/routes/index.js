import { Router } from 'express';
import userAuth from './api/auth/userAuth';
import fbAuth from './api/auth/strategy/fbAuth';


const router = Router();
router.use('/api/v1', userAuth);
router.use('/api/v1', fbAuth);



export default router;
