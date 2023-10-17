import { HttpException, HttpStatus } from '@nestjs/common';

type TExceptionResponseType =
  | 'forbidden'
  | 'internal_server_error'
  | 'not_enough_permissions'
  | 'unauthorized'
  | 'invalid_credentials'
  | 'invalid_otp_code';
  
  interface IHttpExceptionResponse {
      type: TExceptionResponseType;
  message: string;
  solution: string;
}

export class ApiHttpException extends HttpException {
    constructor(data: IHttpExceptionResponse, statusCode: HttpStatus) {
        super({ statusCode, ...data }, statusCode);
    }
}

export class UserExistsException extends ApiHttpException {
    constructor() {
      super(
        {
            type: 'forbidden',
            message: 'User already exists',
            solution: 'Please go to login page'
        }, HttpStatus.FORBIDDEN
      );
    }
}
