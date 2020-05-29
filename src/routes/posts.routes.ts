import { Router, Request, Response } from 'express';

const postRoutes = Router();

postRoutes.get('/', (req: Request, res: Response) => { 
    res.send('Posts Routes');
});

export default postRoutes;
