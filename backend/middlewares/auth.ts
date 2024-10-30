import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  userId: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
  if (!token) return res.status(403).send('Token is required');
  const verify: any = jwt.verify(token, process.env.JWT_SECRET || '');
  // console.log(verify);
  if (!verify) {
    res.status(401).json({ message: 'Invalid Token' });
  }
  req.userId = verify.userId;
  next();
};

export default authMiddleware;
