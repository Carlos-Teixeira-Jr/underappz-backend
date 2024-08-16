import { Injectable } from '@nestjs/common'
import { jwtConstants } from '../constants'
import { UserService } from 'src/modules/users/users.service'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.sub)

    return {
      _id: payload.sub,
      username: payload.username,
      ...user,
    }
  }
}
