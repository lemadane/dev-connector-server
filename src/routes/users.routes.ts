import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { UserModel } from '../models/user.model';

import { getAccessToken } from '../common/utilities';
import { getPassword, getAvatar } from '../common/utilities';
import { OK, CREATED } from '../common/http-status';
import { Conflict, ValidationFailure, sendError } from '../common/error';

const routes = Router();

routes.get('/',
    async (_, res: Response) => {
        return res.json({ message: 'It works' });
    });

routes.post(
    '/',
    [
        check('name', '\'name\' is required.').not().isEmpty(),
        check('email', 'Please include a valid email.').isEmail(),
        check('password', 'Please enter a password with 6 or more characters.')
            .isLength({ min: 6 }),
    ],
    async (request: Request, response: Response, next: (error: any)=>void) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            throw new ValidationFailure({ message: errors.array().join() });
        }
        let { name, email, password } = request.body;
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
            return response.status(CREATED).send({ accessToken });
        } catch (error) {
            return await sendError(error, response);
        }
    });

export default routes;
