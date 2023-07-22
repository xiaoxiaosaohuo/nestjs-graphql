import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/signup-input';
import { SignInInput } from './dto/signin-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/prisma/prisma.service';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,private jwtService:JwtService,private configService: ConfigService ) { }
  async signup(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        username: signUpInput.username,
        email: signUpInput.email,
        hashedPassword: hashedPassword,
      }
    })
   
    const {accessToken,refreshToken} = await this.createTokens(user.id,user.email)
    await this.updateRefreshToken(user.id,refreshToken)
    return {accessToken,refreshToken,user}
  
    
  }
  async signin(signInInput: SignInInput) {
    const user = await this.prisma.user.findUnique({ where: { email: signInInput.email } })
    if (!user) {
       throw new ForbiddenException('Invalid credentials')
    } else {
      const isMatch = await argon.verify(user.hashedPassword, signInInput.password)
      if (!isMatch) { 
         throw new ForbiddenException('Password is not correct')
      }
      const {accessToken,refreshToken } = await this.createTokens(user.id,user.email)
      return {accessToken,refreshToken,user}
    }
    
  }
  
  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken:{not:null}
      },
      data: {
         hashedRefreshToken:null
      }
      
    })
    return {
      loggedOut:true
    }

  }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  async createTokens(userId: number,email:string) {
    const accessToken = this.jwtService.sign({
      userId,
      email
    },{expiresIn:"10s",secret:this.configService.get("ACCESS_SECRET")})
    const refreshToken = this.jwtService.sign({
      userId,
      email,
      accessToken
    },{expiresIn:"1d",secret:this.configService.get("REFRESH_SECRET")})
    return {accessToken,refreshToken}
  }
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        hashedRefreshToken: hash
      }
    })
  
  }
}
