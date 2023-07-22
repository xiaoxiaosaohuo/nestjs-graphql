import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }
  async getHello(): Promise<any> {
    return await this.prisma.user.create({
      data: {
        username: 'xxx',
        hashedPassword: 'XXX',
        email: 'XXXXXXXXXXXXX',
        hashedRefreshToken: 'XXXXXXXXXXXXX',
      }
    })
  }
}
