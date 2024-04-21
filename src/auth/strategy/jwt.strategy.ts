import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { constants } from "src/constants/constants";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants.secret
        })
    }

    async validate(payload: any) {
        console.log(payload);
        console.log(payload.id);
        
        return { userId: payload.id, username: payload.username, role: payload.role }
    }
}