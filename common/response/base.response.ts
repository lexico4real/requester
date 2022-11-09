/* eslint-disable prettier/prettier */
export default class BaseResponse {
  constructor(
    private statusCode: number,
    private message: string,
    private data: any,
  ) {}

  async success(): Promise<any> {
    return {
      status: this.statusCode,
      message: this.message,
      data: this.data,
    };
  }

  async error(): Promise<any> {
    return {
      status: this.statusCode,
      message: this.message,
      data: this.data,
    };
  }
}
