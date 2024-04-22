import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { constants } from 'src/constants/constants';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: constants.secret,
    });
  }

  async validate(payload: any) {
    // console.log(payload);
    console.log(payload.id);

    return { userId: payload.id, username: payload.username, role: payload.role };
  }
}
