import { Router, Request, Response } from 'express';
import { authMiddleware, validatePassword, getPassword, getAccessToken } from '../common/utilities';
import { User, UserModel } from '../models/user.model';
import { OK } from '../common/http-status';
import { NotFound, ValidationFailure, Unauthorized, sendError } from '../common/error';
import { check, validationResult } from 'express-validator';

const authRoutes = Router();

authRoutes.get(
  '/',
  authMiddleware,
  async (request: Request, response: Response) => {
    try {
      const user = (await UserModel.findById(request.headers.userId!)
        .select('-password')) as unknown as User;
      if (user && user.active) {
        const out = await formatUser(user);
        response.json(out);
      } else {
        throw new NotFound({ message: 'User not found' });
      }
    } catch (error) {
      return await sendError(error, response);
    }
  });

authRoutes.post(
  '/',
  [
    check('email', 'Please include a valid email.').isEmail(),
    check('password', 'Please enter a password with 6 or more characters.').exists(),
  ],
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      throw new ValidationFailure({ message: errors.array().join() });
    }
    let { email, password } = request.body;
    try {
      const user = <User><unknown>await UserModel.findOne({ email });
      if (!user) {
        throw new Unauthorized({ message: 'Invalid credentials.' });
      }
      const match = await validatePassword(<string>password, user.password);
      if (!match) {
        throw new Unauthorized({ message: 'Invalid credentials.' });
      }
      const accessToken = await getAccessToken(user.id);

      return response.json({ accessToken });
    } catch (error) {
      return await sendError(error, response);
    }
  });

async function formatUser(user: User): Promise<User> {
  return Promise.resolve(<User>{
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    created: user.created,
    updated: user.updated,
  });
}

export default authRoutes;
