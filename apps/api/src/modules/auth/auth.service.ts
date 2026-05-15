import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './enums/role.enum';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = (await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      role: Role.CUSTOMER,
    })) as UserDocument;

    const tokens = await this.generateTokens({
      sub: String(user._id),
      email: user.email,
      role: user.role as Role,
    });

    return {
      message: 'Register success',

      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },

      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = (await this.usersService.findByEmail(
      dto.email,
    )) as UserDocument;

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens({
      sub: String(user._id),
      email: user.email,
      role: user.role as Role,
    });

    return {
      message: 'Login success',

      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },

      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret:
            this.configService.get<string>('JWT_REFRESH_SECRET') ??
            'super-refresh-secret',
        },
      );

      return this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_ACCESS_SECRET') ??
        'super-secret-access',

      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ??
        'super-refresh-secret',

      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
