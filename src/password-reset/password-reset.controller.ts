import { Body, Controller, Query, Patch, Post } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import RandomCode from 'common/util/random-code';

@Controller('auth')
export class PasswordResetController {
  constructor(private passwordResetService: PasswordResetService) {}

  @Post('/request-reset')
  async resetPassword(@Body('email') email: string) {
    const randomCode = new RandomCode();
    const token = randomCode.generate(32);
    const passwordReset = await this.passwordResetService.createRequest(
      email,
      token,
    );
    return passwordReset;
  }

  @Patch('/update-password')
  async updatePassword(@Query() body: any, @Body('password') password: string) {
    const { email, token } = body;
    const updatedUser = await this.passwordResetService.updatePassword(
      token,
      email,
      password,
    );
    return updatedUser;
  }
}
