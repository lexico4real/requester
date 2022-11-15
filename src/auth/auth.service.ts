import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { PasswordResetService } from 'src/password-reset/password-reset.service';
import RandomCode from 'common/util/random-code';

@Injectable()
export class AuthService {
  @Inject(PasswordResetService)
  private readonly passwordResetService: PasswordResetService;
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    function makePassword(length: number) {
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }
      return result;
    }

    authCredentialsDto.password = makePassword(10);

    const result = await this.usersRepository.createUser(authCredentialsDto);

    const randomCode = new RandomCode();
    const token = randomCode.generate(32);
    await this.passwordResetService.createRequest(
      authCredentialsDto.email,
      token,
    );
    return result;
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = signInCredentialsDto;

    const user = await this.usersRepository.findOne({ email });

    if (user && !user.isVerified) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error:
            'you have not yet verified your registration. check your email',
        },
        HttpStatus.UNAUTHORIZED,
      );
    } else if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getAllUsers(): Promise<any> {
    const result = await this.usersRepository.find();
    // remove password from result
    result.forEach((user) => {
      delete user.password;
    });

    return {
      status: 'success',
      code: HttpStatus.OK,
      message: 'users retrieved',
      data: result,
      time: new Date(),
    };
  }
}
