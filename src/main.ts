import * as express from 'express';
import { Request, Response } from 'express';
import * as log from 'fancy-log';

const app = express();
app.get('/', (req: Request, res: Response) => res.send('API running'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => log(`Server started at Port, ${PORT}`));