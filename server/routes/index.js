import userAuth from './api/auth/userAuth';

const router = require('express').Router();

router.use('/api', require('./api'));

router.use('/api/v1', userAuth);

export default router;
