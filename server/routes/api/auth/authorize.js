import { Router} from 'express';
import Authorization from '../../../controllers/Authorization';
import RoleAuthorization  from '../../../middlewares/RoleAuthorization';
import JWTAuthentication from '../../../middlewares/JWTAuthentication';
import { SUPERADMIN } from '../../../helpers/constants';

const router = Router();

router.get('/',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN),
  Authorization.getAllRoles
);

router.post('/',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN),
  Authorization.postANewRole
);

router.put('/:type',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN),
  Authorization
);

router.put('/user/:id',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN),
  Authorization
);

router.delete('/',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN),
  Authorization.deleteARole
);

export default router;
