import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { Request, Response } from 'express';
import { getText } from './helper/helper';
import { Result } from './types/common/result.type';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    try {
      let messages;
      let status;
      if (exception instanceof Result) {
        const result: any = exception;
        status = result.statusCode;
        messages = result.messages;
      } else {
        status = exception.getStatus();
        const excRes: any = exception.getResponse();
        messages = excRes?.messages ?? [];
        const defVal = exception.message;
        if (!messages.length) {
          messages.push(defVal);
        }
      }

      response.status(400).send({
        statusCode: status ?? -1,
        messages: messages ?? [],
      });
    } catch (e) {
      const errorKey = 'error_occur_please_try_again';
      response.status(400).send({
        statusCode: 400,

        messages: [getText(errorKey)],
      });
    }
  }
}
