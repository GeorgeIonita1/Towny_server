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

export class UserAlreadyExistsException extends ApiHttpException {
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

export class UserDoesNotExistException extends ApiHttpException {
    constructor() {
        super({
            type: 'forbidden',
            message: 'User does not exist',
            solution: 'Please go to register page'
        }, HttpStatus.FORBIDDEN)
    };
}

export class UserInvalidCredentialsException extends ApiHttpException {
    constructor() {
        super({
            type: 'invalid_credentials',
            message: 'Invalid credentials',
            solution: 'Please try again or recover your password.'
        }, HttpStatus.UNAUTHORIZED)
    };
}
