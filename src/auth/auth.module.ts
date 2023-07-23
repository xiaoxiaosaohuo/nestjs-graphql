import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportStrategy } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';

@Module({
  providers: [AuthResolver, AuthService,JwtService,PrismaService,AccessTokenStrategy]
})
export class AuthModule {}
