import {
    ExecutionContext,
    Injectable

} from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from 'rxjs';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
    constructor(private reflector :Reflector) {
        super();
    
    }
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context)
        return ctx.getContext().req;
    }

    canActivate(context: ExecutionContext):boolean | Promise<boolean> | Observable<boolean> { 
        const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()])
        console.log('isPublic',isPublic)
        // return true
        if (isPublic) {
            return true
        }
        return super.canActivate(context)
    }
}