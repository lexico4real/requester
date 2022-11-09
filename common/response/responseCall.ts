/* eslint-disable prettier/prettier */
import BaseResponse from './base.response';
import { ResponseCode } from './responseCode';
import Logger from 'config/log4js/logger';
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
export class ResponseCall {
  public statusCode: number;
  public message: string;
  public data: any;
  constructor(
    statusCode: number,
    message: string,
    data: any,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
  async responseCall(
    statusCode: number,
    message: string,
    data: any,
  ): Promise<any> {
    const logger = new Logger();
    let response: BaseResponse;
    try {
      response = new BaseResponse(statusCode, message, data);

      if (statusCode >= 200 && statusCode < 300) {
        response = await response.success();
      }
    } catch (error) {
      response = new BaseResponse(statusCode, message, error.code);
      switch (error.code) {
        case ResponseCode.BAD_GATEWAY:
          throw new BadGatewayException(response.error());
        case ResponseCode.BAD_REQUEST:
          throw new BadRequestException(response.error());
        case ResponseCode.CONFLICT:
          throw new ConflictException(response.error());
        case ResponseCode.FORBIDDEN:
          throw new ForbiddenException(response.error());
        case ResponseCode.GATEWAY_TIMEOUT:
          throw new GatewayTimeoutException(response.error());
        case ResponseCode.NOT_FOUND:
          throw new NotFoundException(response.error());
        case ResponseCode.INTERNAL_SERVER_ERROR:
          throw new InternalServerErrorException(response.error());
        case ResponseCode.SERVICE_UNAVAILABLE:
          throw new ServiceUnavailableException(response.error());
        case ResponseCode.UNAUTHORIZED:
          throw new UnauthorizedException(response.error());
        default:
          logger.log(
            'error',
            'trace',
            `Error in responseCall.ts in responseCall function : ${error.message} > ${error.code}`,
            'responseCall',
            );
            response = await response.error();
            throw new InternalServerErrorException(response.error());
      }
    }
    return response;
  }
}
