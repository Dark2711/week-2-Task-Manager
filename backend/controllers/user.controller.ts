import { Request, Response } from 'express';
import z from 'zod';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
interface SignupRequest extends Request {
  body: {
    // Define the expected properties in the request body
    name: string;
    password: string;
    email: string;
  };
}

const signupBody = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});
const signinBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signup = async (req: SignupRequest, res: Response): Promise<void> => {
  const body = req.body;

  const { success } = signupBody.safeParse(body);

  if (!success) {
    res.status(411).json({
      message: 'Invalid Inputs',
    });
    return;
  }

  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) {
    res.status(400).json({
      message: 'User Already with this email',
    });
  }

  try {
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    res.status(211).json({
      message: 'User Created',
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(411).json({
      Error: 'Error creating user',
    });
    return;
  }
};

interface SigninRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

const signin = async (req: SigninRequest, res: Response): Promise<void> => {
  const body = req.body;
  const { success } = signinBody.safeParse(body);
  if (!success) {
    res.status(411).json({
      message: 'Invalid Inputs',
    });
    return;
  }
  try {
    const user = await User.findOne({ email: body.email });
    if (!user) {
      res.status(401).json({
        message: 'User does not exist with this email',
      });
      return;
    }
    if (user.password !== body.password) {
      res.status(411).json({
        message: 'Invalid password',
      });
      return;
    } else {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.status(200).json({
        message: 'Sign In Successfully',
        token,
        userName: user.name,
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
    return;
  }
};

interface VerifyRequest extends Request {
  headers: {
    authorization?: string;
  };
}

const verify = async (req: VerifyRequest, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({
      message: 'No token provided',
    });
    return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      valid: true,
      message: 'Token is valid',
      decoded,
      token,
    });
  } catch (error) {
    res.status(401).json({
      message: 'Invalid token',
    });
  }
};

export { signup, signin, verify };
