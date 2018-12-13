import { Router} from 'express';
import Authorization from '../../../controllers/Authorization';
import RoleAuthorization  from '../../../middlewares/RoleAuthorization';
import JWTAuthentication from '../../../middlewares/JWTAuthentication';

const router = Router();

router.get('/',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser('superAdmin'),
  Authorization.getAllRoles
);

router.post('/',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser('superAdmin'),
  Authorization.postANewRole
);

router.put('/:type',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser('superAdmin'),
  Authorization
);

router.put('/user/:id',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser('superAdmin'),
  Authorization
);

router.delete('/',
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser('superAdmin'),
  Authorization.deleteARole
);

export default router;
