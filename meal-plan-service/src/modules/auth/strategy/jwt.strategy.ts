import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-firebase-jwt";
import { AuthService } from "../auth.service";
import { EXPIRED_TOKEN, INVALID_TOKEN, TOKEN_MALFORMED, TOKEN_NOT_FOUND } from "../../../errors/errors.constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(private authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        });
    }

    async validate(payload: any){
        if(!payload){
            throw new BadRequestException(TOKEN_NOT_FOUND);
        }
        const user = await this.authService.authUserFromToken(payload).catch(err => {
            err = err.errorInfo;
            console.log(err);
            if(err.code === 'auth/argument-error'){
                throw new BadRequestException(TOKEN_MALFORMED);
            }
            if (err.code === 'auth/id-token-expired') {
                throw new UnauthorizedException(EXPIRED_TOKEN);
            }
            if (err.code === 'auth/user-not-found') {
                throw new UnauthorizedException(INVALID_TOKEN);
            }
            console.log(err);
            throw new UnauthorizedException(INVALID_TOKEN);
        });

        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    }
}