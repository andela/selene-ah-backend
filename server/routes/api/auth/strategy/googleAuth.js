import {
  Router
} from 'express';
import GoogleAuth from '../../../../helpers/auth/googleAuthenticate';

const router = Router();

router.get('/auth/google', GoogleAuth.googleRoute());

export default router;
