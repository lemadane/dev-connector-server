export type ErrorInputs = {
    response?: Response;
    status?: number;
    title?: string;
    message?: string;
    tip?: string;
    lang?: string;
    tag?: object;
    error?: Error;
 };

export type Trace = {
    within?: string,
    file: string,
    line: number,
    column: number,
}