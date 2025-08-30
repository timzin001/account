import { JwtService } from '@nestjs/jwt'

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  HttpStatus,
} from '@nestjs/common'
import { getText, getThrowError } from './helper'
import { LANGUAGES } from './constants'

@Injectable()
export class AuthGuardServer implements CanActivate {
  private readonly logger = new Logger(AuthGuardServer.name)
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const headers = request.headers

    const language = headers['accept-language']

    if (!language) {
      throw getThrowError(
        [
          getText('please_enter_name', {
            name: getText('language').toLocaleLowerCase(),
          }),
        ],
        HttpStatus.UNAUTHORIZED,
      )
    }
    if (language && !LANGUAGES.includes(language)) {
      throw getThrowError(
        [getText('language_is_not supported')],
        HttpStatus.UNAUTHORIZED,
      )
    }

    const serverKey = headers['sever-key']
    if (serverKey != process.env.SERVER_CHAT_KEY) {
      throw getThrowError(
        [getText('you_dont_have_permission_to_access_data')],
        HttpStatus.UNAUTHORIZED,
      )
    }

    return true
  }
}
