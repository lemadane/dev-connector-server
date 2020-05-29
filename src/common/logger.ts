const { log: l, error: e, debug: d, info: i } = console;

export const log = (...data: any[]) => {
    l(`[${new Date().toLocaleString()}]: ${data}`);
};

export const logInfo = (...data: any[]) => {
    i(`[${new Date().toLocaleString()}]: ${data}`);
};

export const logDebug = (...data: any[]) => {
    d(`[${new Date().toLocaleString()}]: ${data}`);
};

export const logErr = (...data: any[]) => {
    e(`[${new Date().toLocaleString()}]: ${data}`);
};