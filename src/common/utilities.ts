import { hash, genSalt } from 'bcryptjs';
import * as gravatar from 'gravatar';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Unauthorized } from './error';


export async function getPassword(password: string) {
    const ROUNDS = 10;
    const salt = await genSalt(ROUNDS);
    return await hash(password, salt);
}

export async function getAvatar(email: string) {
    return Promise.resolve(gravatar.url(email, { s: '200', r: 'pg', d: 'mm' }));
}

export async function authMiddleware(req: Request, res: Response, next: Function) {
    try {
        const token = req.headers.authorization?.split(' ') as string[];
        if (token?.length && token[0] !== 'Bearer') {
            throw new Unauthorized({ message: 'No access.' });
        }
        req.headers.userId = await decodeAccessToken(token[1]);
        next();
    } catch (error) {
        return error.send(res);
    }
}

export function getAccessToken(id: string): Promise<string> {
    const DAYS = 7;
    return new Promise((resolve, reject) => {
        jwt.sign({ sub: id, },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: 1000 * 60 * 60 * 24 * DAYS },
            (err: Error | null, token?: string) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            }
        );
    });
}

async function decodeAccessToken(accessToken: string): Promise<string> {
    return new Promise((resolve) => {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as jwt.Secret) as { sub: string; };
        resolve(decoded.sub);
    });
}