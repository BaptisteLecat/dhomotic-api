import { AuthGuard } from "@nestjs/passport";
import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { API_KEY_NOT_FOUND, INVALID_API_KEY } from "../../../errors/errors.constants";

@Injectable()
export class ApiKeyAuthGuard extends AuthGuard('api-key') {
    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        console.log('ApiKeyAuthGuard');
        if (info && info.name === 'BadRequestError') {
            throw new BadRequestException(API_KEY_NOT_FOUND);
        }

        if (err || !user) {
            throw err || new UnauthorizedException(INVALID_API_KEY);
        }

        return user;
    }
}