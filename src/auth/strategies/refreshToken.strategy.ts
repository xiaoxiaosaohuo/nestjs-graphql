import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from "@nestjs/config";
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types";
import { Request } from "express";


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        public readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('REFRESH_SECRET'),
            passReqToCallback: true
        
        })
    }

     validate(req:Request,payload: JwtPayload):JwtPayloadWithRefreshToken {
        console.log("validate")
        const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim()
        return {...payload,refreshToken}
    }
}