import { RequestHandler, Router } from 'express';
import { signin, signup, verify } from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);

userRouter.get('/verify', authMiddleware as RequestHandler, verify);
export default userRouter;
