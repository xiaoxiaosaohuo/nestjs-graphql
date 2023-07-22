import { Field,ObjectType } from "@nestjs/graphql";
import {User} from  "../../user/user.entity";
import { IsNotEmpty,IsString } from 'class-validator';

@ObjectType()
export class SignResponse {
    @IsNotEmpty()
    @IsString()
    @Field()
    accessToken: string;

    @IsNotEmpty()
    @IsString()
    @Field(() => User)
    user: User;

    @IsNotEmpty()
    @IsString()
    @Field()
    refreshToken: string;
} 