import * as express from 'express';
import { Request, Response } from 'express';
import { config } from 'dotenv';
import * as morganBody from 'morgan-body';
import * as helmet from 'helmet';
import { dbConnect } from './db';
import * as cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import { ApiError } from './common/error';
import { logErr, log } from './common/logger';

config();
dbConnect();

const app = express();
morganBody(app);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => res.send('API running'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    log(`Server is running in '${process.env.NODE_ENV}' mode at port ${PORT}.`);
});

process.on('uncaughtException', async (err: Error) => {
    logErr('uncaughtException', ApiError.info(err));
    process.exit(1);
});

process.on('unhandledRejection', async (err: any) => {
    logErr('unhandledRejection', ApiError.info(err));
    process.exit(1);
});

process.on('warning', async (warning) => {
    logErr('warning', ApiError.info(warning));
});