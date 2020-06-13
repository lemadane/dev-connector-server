import { Router, Request, Response } from 'express';
import { authMiddleware } from '../common/utilities';
import { check, validationResult } from 'express-validator';
import { BadRequest, sendError } from '../common/error';
import { UserModel, User } from '../models/user.model';
import { PostModel } from '../models/post.model';
import { CREATED } from '../common/http-status';

const postRoutes = Router();

const createPost =  async (request: Request, response: Response) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            throw new BadRequest({ message: errors.array().join() });
        }
        const user = <User> <unknown>await UserModel
            .findById(request.headers.userid)
            .select('-password');

        const newPost = new PostModel({
            text: request.body.text,
            name: user?.name,
            avatar: user?.avatar,
            user: request.headers.userid,
        });
        response.status(CREATED).send(newPost);
    } catch (error) {
        return await sendError(error, response);
    }
};

postRoutes.post(
    '/',
    authMiddleware,
    [
        check('text', 'Text is required').not().isEmpty(),
    ],
    createPost);

export default postRoutes;

