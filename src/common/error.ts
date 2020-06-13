import ExtendableError from 'ts-error';
import { ErrorInputs, Trace } from './types';
import * as http from './http-status';
import { Response } from 'express';
import { INTERNAL_SERVER_ERROR } from './http-status';
import { logErr } from './logger';
/*
* Extendable error extends JS Error
*/
export class ApiError extends ExtendableError {

  name: string = '';

  status: number = 500;

  title: string = '';

  message: string = '';

  lang: string = 'en';

  tip?: string;

  tag?: object;

  constructor(inputs: ErrorInputs) {
    super(inputs.message);
    this.name = this.constructor.name;
    this.status = inputs.status || this.status;
    this.title = inputs.title || this.title;
    this.message = inputs.error?.message || inputs.message || this.message;
    this.tip = inputs.tip || this.tip;
    this.tag = inputs.tag || this.tag;
    this.lang = inputs.lang || this.lang;
    this.stack = inputs?.error?.stack || this.stack;
  }

  async send(res: Response) {
    res.status(this.status).send({
      name: this.name,
      title: this.title,
      message: this.message,
      tip: this.tip,
      lang: this.lang,
    });
  }

  static async parseStack(stackTrace: string | undefined): Promise<Trace[] | undefined> {
    return new Promise(
      async (resolve: () => void) => {
        const result: Trace[] = [];
        if (stackTrace) {
          const lines = stackTrace?.split('\n')?.slice(1, stackTrace.length);
          lines.forEach((line) => {
            line = line?.trim();
            if (line) {
              if ((line?.startsWith('at'))) {
                line = line.replace('at', '');
                line = line.trim();
                if (line?.includes('(')) {
                  line = line.replace(' (', ':');
                  line = line.replace(')', '');
                  const parts = line.split(':');
                  result.push({
                    within: parts[0]?.trim(),
                    file: parts[1]?.trim(),
                    line: parseInt(parts[2]?.trim()),
                    column: parseInt(parts[3]?.trim()),
                  });
                } else {
                  const parts = line.split(':');
                  result.push({
                    file: parts[0]?.trim(),
                    line: parseInt(parts[1]?.trim()),
                    column: parseInt(parts[2]?.trim()),
                  });
                }
              }
            }
          });
        }
        return undefined;
      }
    );
  }

  static async info(error: Error) {
    return {
      message: error.message,
      stackTrace: await ApiError.parseStack(error.stack),
    };
  }
}

export async function sendError(error: any, response: Response) {
  const err = !!error.status ? error as ApiError : new ApiError(error); 
  return err.send(response);
}

export class BadRequest extends ApiError {
  status = http.BAD_REQUEST;
  title = 'Bad Request.';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}

export class Unauthorized extends ApiError {
  status = http.UNAUTHORIZED;
  title = 'Unathorized';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}

export class Forbidden extends ApiError {
  status = http.FORBIDDEN;
  title = 'Forbidden.';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}

export class NotFound extends ApiError {
  status = http.NOT_FOUND;
  title = 'Data not found.';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}

export class RequestTimeout extends ApiError {
  status = http.REQUEST_TIMEOUT;
  title = 'Request Timeout.';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}

export class Conflict extends ApiError {
  status = http.CONFLICT;
  title = 'Conflict';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}

export class MethodFailure extends ApiError {
  status = http.METHOD_FAILURE;
  title = 'Method Failure';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}

export class SystemError extends ApiError {
  status = http.INTERNAL_SERVER_ERROR;
  title = 'System Error.';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}

export class ValidationFailure extends ApiError {
  status = http.UNPROCESSABLE_ENTITY;
  title = 'Validation Failure.';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}

export class InvalidAccessToken extends Unauthorized {
  title = 'Invalid Access Token';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}

export class ServiceUnavailable extends ApiError {
  status = http.SERVICE_UNAVAILABLE;

  title = 'Service is Not Available';

  constructor(inputs: ErrorInputs) {
    super(inputs);
  }
}