// @ts-nocheck
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { AxiosError } from 'axios';
import { Response } from 'express';
@Injectable()
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002': {
        //Unique constraint failed on the {constraint}
        const status = HttpStatus.BAD_REQUEST;
        const message = `${exception.meta.target[0]} already exits`;
        response.status(status).json({
          statusCode: status,
          message: message,
        });
        break;
      }

      case 'P2025': {
        // A constraint failed on the database: {database_error}
        const status = HttpStatus.BAD_REQUEST;
        const field =
          (exception.meta.cause as string).split("'")[1] ||
          exception.meta.modelName;

        response.status(status).json({
          statusCode: status,
          message: `${field} given does not exists`,
        });
        break;
      }
      default:
        console.log(exception);
        throw new InternalServerErrorException();
        break;
    }
  }
}

@Injectable()
@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');
    if (exception instanceof HttpException) {
      throw exception;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'some thing went wrong',
    });
  }
}
@Injectable()
@Catch(HttpException)
export class ExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // Extract custom error response if provided (optional)
    const errorResponse = exception.getResponse() as
      | { message?: string; error?: any }
      | undefined;

    response.status(status).json({
      statusCode: status,
      // Use a more informative error message if provided in the exception
      message: errorResponse?.message || exception.message,
      // Include optional error details for debugging (based on your security considerations)
      error:
        process.env.NODE_ENV !== 'production'
          ? errorResponse?.error
          : undefined,
    });
  }
}

@Injectable()
@Catch(AxiosError)
export class AxiosExceptionFilter extends BaseExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.response?.status || 500;
    let message = 'Something went wrong';
    // switch (status) {
    //   case 400:
    //     if (
    //       // @ts-ignore
    //       exception.response?.data?.errorCode === 'E0000001' &&
    //       (
    //         exception.response.data?.errorCauses[0].errorSummary as string
    //       ).includes('already exists')
    //     )
    //       //E0000001:Okta error : API validation exception
    //       message = exception.response.data.errorCauses[0].errorSummary;
    //     console.log(exception.response.data);
    //     break;
    //   case 404:
    //     message = 'User not found';
    //     break;
    //   case 500:
    //     console.log(exception);
    //     break;
    //   default:
    //     message = exception.response.data.errorCauses[0].errorSummary;
    //     break;
    // }

    if (exception?.response?.data) {
      if (exception.response?.data?.error_description) {
        message = exception.response.data.error_description;
      } else if (exception.response.data.errorCauses.length != 0) {
        message = exception.response.data.errorCauses[0].errorSummary;
      } else {
        message = exception.response?.data.errorSummary;
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      // path: request.url,
      message,
    });
  }
}

// export class PrismaExceptionFilter extends BaseExceptionFilter {
//   status: HttpStatus;
//   message: string;

//   constructor(error: PrismaError) {
//     super(error.message, HttpStatus.INTERNAL_SERVER_ERROR); // Set defaults

//     this.status = HttpStatus.INTERNAL_SERVER_ERROR;
//     this.message = 'Internal Server Error'; // Default message

//     // Handle specific Prisma errors (focus on common ones)
//     switch (error.code) {
//       case 'P2002': // Unique constraint violation (can be adapted for foreign key)
//         this.status = HttpStatus.CONFLICT;
//         this.message = 'The data you provided violates a constraint.';
//         break;
//       case 'P2025': // Not found
//         this.status = HttpStatus.NOT_FOUND;
//         this.message = 'Record not found.';
//         break;
//       case 'P1000': // Invalid input
//         this.status = HttpStatus.BAD_REQUEST;
//         this.message = 'Invalid input data provided.';
//         break;
//       case 'P1001': // Required field missing
//         this.status = HttpStatus.BAD_REQUEST;
//         this.message = 'A required field is missing in the request.';
//         break;
//       // You can add mappings for other common errors as needed
//       default:
//         console.error('Unhandled Prisma error:', error);
//     }
//   }
// }
