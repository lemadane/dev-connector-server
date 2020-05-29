import { Router, Request, Response } from 'express';
import { authMiddleware } from '../common/utilities';
import UserModel, { User } from '../models/user.model';
import { OK } from '../common/http-status';
import { NotFound } from '../common/error';
import { Document } from 'mongoose';

const authRoutes = Router();

authRoutes.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.findById(req.headers.userId!).select('-password')) as unknown as User;
    if (user && user.active) {
      const out = await fixUserObject(user);
      res.status(OK).send(out);
    } else {
      throw new NotFound({ message: 'User not found' });
    }
  } catch (error) {
    return error.send(res);
  }
});

async function fixUserObject(user: User): Promise<object> {
  return Promise.resolve({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    created: user.created,
    updated: user.updated,
  });
}

export default authRoutes;
