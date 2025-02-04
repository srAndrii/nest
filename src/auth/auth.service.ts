import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user || !(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException('User or password is incorrect');
    }
    return user;
  }

  async login(user:IUser) {
    const {id, email} = user;
    return{
      id,email, token: this.jwtService.sign({id:user.id, email:user.email})
    }
  }
}