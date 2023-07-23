import { createParamDecorator } from "@nestjs/common";
import { JwtPayloadWithRefreshToken } from '../types';
import { GqlExecutionContext } from "@nestjs/graphql";
import {
    ExecutionContext,
    Injectable

} from "@nestjs/common";

export const CurrentUserId = createParamDecorator((_:undefined, context: ExecutionContext)=> {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    
    return req.user.userId
    
})