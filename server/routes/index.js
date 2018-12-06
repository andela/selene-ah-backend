import { Router } from 'express';
import passport from 'passport';
import userAuth from './api/auth/userAuth';


const router = Router();
router.use('/api/v1', userAuth);
// router.use('/api', api);
router.get('/api/v1/facebook',
  passport.authenticate('facebook',
    { session: false }), (req, res) => {
      res.json({
        msg: 'Works'
      });
});

router.get('/api/v1/auth/facebook/callback', 
  passport.authenticate('facebook', 
  { session: false }), (req, res) => {
    res.json({
      msg: 'Working'
    });
});

export default router;
