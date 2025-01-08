import { HttpException, HttpStatus, Logger } from "@nestjs/common";

import { instanceToPlain } from 'class-transformer';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

export class BaseHttpException extends HttpException {
  protected exceptionName = this.constructor.name; 
  public responseModel: any;

  constructor(httpCode: HttpStatus, code: string, message: string, meta?: any) {
    super(message, httpCode);
    if (!this.responseModel) {
      this.responseModel = {
        success: false,
        error: {
          message: message,
          code: httpCode+code,
          type: this.exceptionName,
        },
      };
      if (meta) {
        this.responseModel['meta'] = meta;
      }
    }
  }
}

@Catch(BaseHttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(this.constructor.name);
  catch(exception: BaseHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const responseData = exception.responseModel;
    const status = exception['status'] || 500;
    const response = instanceToPlain(responseData);
    if (!response.meta) {
      response.meta = {}
    }
    
    this.logger.error({ msg: 'Sending response err', statusCode: status, method: req.method, url: req.url, body: response });

    res
      .status(status)
      .json(response);
  }
}

export class AuthException extends BaseHttpException {
  constructor(code: string, message?: string) {
    super(HttpStatus.UNAUTHORIZED, code, `Unauthorized.${message ? ' ' + message : ''}`);
  }
}

export class UnknownException extends BaseHttpException {
  constructor() {
    super(HttpStatus.INTERNAL_SERVER_ERROR, '', 'Generic error');
  }
}
