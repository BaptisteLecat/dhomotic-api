import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { HeaderAPIKeyStrategy } from "passport-headerapikey"
import { AuthService } from "../auth.service"

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
    constructor(private readonly authService: AuthService) {
        super({header: 'api-key', prefix: ''}, true, async (apikey, done) => {
            if (!authService.validateApiKey(apikey)) {
                return done(null, false)
            }
            return done(null, true)
        });
    }
}