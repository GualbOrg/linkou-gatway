import { HttpException, HttpStatus } from '@nestjs/common';

export type LinkouError = {
  message: string;
  errorCode: string;
};

export class LinkouException extends HttpException {
  constructor(errors: LinkouError[] | LinkouError) {
    if (!Array.isArray(errors)) {
      errors = [errors];
    }
    super(errors, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
