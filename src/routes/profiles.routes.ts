import { Router, Request, Response } from 'express';

const profileRoutes = Router();

profileRoutes.get('/', (req: Request, res: Response) => { 
    res.send('Profile Routes');
});

export default profileRoutes;