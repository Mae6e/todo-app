import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { RESPONSE_MESSAGES } from './../constants/messages';
import { IResponse } from '../interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<IResponse> {
    const { email, password } = signupDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser)
      throw new UnauthorizedException(RESPONSE_MESSAGES.AUTH.EMAIL_EXISTS);

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({
      email,
      password: hashedPassword,
    });
    return { success: true, message: RESPONSE_MESSAGES.AUTH.SIGNUP_SUCCESS };
  }

  async signin(SigninDto: SigninDto): Promise<IResponse> {
    const { email, password } = SigninDto;
    const user = await this.userModel.findOne({ email });

    if (!user)
      throw new UnauthorizedException(
        RESPONSE_MESSAGES.AUTH.INVALID_CREDENTIALS,
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException(
        RESPONSE_MESSAGES.AUTH.INVALID_CREDENTIALS,
      );

    const payload = { id: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      success: true,
      message: RESPONSE_MESSAGES.AUTH.SIGNIN_SUCCESS,
      data: { token },
    };
  }
}
