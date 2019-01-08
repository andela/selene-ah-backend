/* eslint-disable max-len */
import { Router } from 'express';
import JWTAuthentication  from '../../../middlewares/JWTAuthentication';
import NotificationController from '../../../controllers/notification/NotificationController';

const notificationRoute = Router();

notificationRoute.post(
  '/notification/opt',
  JWTAuthentication.authenticateUser,
  NotificationController.notificationOptInOut
);

export default notificationRoute;
