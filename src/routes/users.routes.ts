import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import UserModel from '../models/user.model';

import { getAccessToken } from '../common/utilities';
import { getPassword, getAvatar } from '../common/utilities';
import { OK } from '../common/http-status';
import { Conflict, ValidationFailure } from '../common/error';

const userRoutes = Router();

userRoutes.get('/',
    async (_, res: Response) => {
        return res.status(OK).send({ message: 'It works' });
    });

userRoutes.post(
    '/',
    [
        check('name', '\'name\' is required.').not().isEmpty(),
        check('email', 'Please include a valid email.').isEmail(),
        check('password', 'Please enter a password with 6 or more characters.')
            .isLength({ min: 6 }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationFailure({ message: errors.array().join() });
        }
        let { name, email, password } = req.body;
        try {
            const exists = await UserModel.exists({ email });
            if (exists) {
                throw new Conflict({ message: 'Cannot save a user that already exists.' });
            }
            const avatar = await getAvatar(email);
            password = await getPassword(password);
            const user = new UserModel({ name, email, password, avatar, active: true });
            const doc = await user.save();
            const accessToken = await getAccessToken(doc.id);

            return res.status(OK).send({ accessToken });
        } catch (err) {
            return err.send(res);
        }
    });

export default userRoutes;
