import { Router } from 'express';

import { authController } from '../Controllers/AuthController';
import { authMiddleware } from './Middleware/AuthMiddleware';
import { WalletController } from '../Controllers/WalletController';

const router = Router();

router.get('/', (req, res, next) => {
    res.status(200).send({ message: "Hello world"});
    return next();
});

router.post('/login', authController.login);
router.post('/login/signup', authController.signUpNewUser);

router.use(authMiddleware);

router.post('/ballance', WalletController.createBallance);

export { router as routes};