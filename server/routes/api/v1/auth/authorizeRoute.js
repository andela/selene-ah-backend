import { Router} from 'express';
import Authorization
from '../../../../controllers/auth/AuthorizationController';
import RoleAuthorization  from '../../../../middlewares/RoleAuthorization';
import JWTAuthentication from '../../../../middlewares/JWTAuthentication';
import { SUPERADMIN } from '../../../../helpers/constants';

const router = Router();

router.get('/role',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN),
  Authorization.getAllRoles
);

router.post('/role',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN),
  Authorization.postANewRole
);

router.put('/role/:type',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN),
  Authorization
);

router.put('/role/user/:id',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN),
  Authorization
);

router.delete('/role',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN),
  Authorization.deleteARole
);

export default router;
