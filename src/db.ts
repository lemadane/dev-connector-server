import { connect } from 'mongoose';
import { logInfo, logErr } from './common/logger';

export const dbConnect = async (): Promise<void> => {
    try {
        await connect(
            process.env.MONGO_URI as string,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            });
        logInfo('Connected to DB.');
    } catch (err) {
        logErr(err.message);
    }
};
