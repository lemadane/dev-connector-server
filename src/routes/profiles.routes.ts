import { Router, Request, Response } from 'express';
import { ProfileModel } from '../models/profile.model';
import { BadRequest, NotFound, sendError } from '../common/error';
import { authMiddleware } from '../common/utilities';
import { check, validationResult } from 'express-validator';

const profileRoutes = Router();

profileRoutes.get('/me', authMiddleware,
	async (request: Request, response: Response): Promise<Response<any> | void> => {
		try {
			const profile = ProfileModel.findOne({ user: request.headers.userid })
				.populate('user', ['name', 'avatar']);
			if (!profile) {
				throw new NotFound({ message: 'No profile for this user.' });
			}
			return response.json(profile);
		} catch (error) {
			return await sendError(error, response);
		}
	}
);

profileRoutes.post(
	'/',
	authMiddleware,
	[
		check('status', 'Status is required').not().isEmpty(),
		check('skills', 'Skills is required').not().isEmpty(),
	],
	async (request: Request, response: Response): Promise<Response<any> | void> => {
		try {
			const errors = validationResult(request);
			if (!errors.isEmpty()) {
				throw new BadRequest({ message: errors.array().join() });
			}
			const {
				company,
				location,
				website,
				bio,
				skills,
				status,
				githubusername,
				youtube,
				twitter,
				instagram,
				linkedin,
				facebook
			} = request.body;
		} catch (error) {
			return await sendError(error, response);
		}
	}
);

export default profileRoutes;