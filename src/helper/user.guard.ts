// import { JwtService } from '@nestjs/jwt'

// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   Logger,
//   HttpStatus,
//   HttpException,
// } from '@nestjs/common'
// import { getText, getThrowError, getToken } from './helper'
// import { ACCEPT_TYPE, Keys, LANGUAGES } from './constants'
// import { FastifyRequest } from 'fastify'
// import { decrypt } from './crypto'
// import { UserRepository } from 'src/repository/user/user.repository'
// import { AuthUserRepository } from 'src/repository/user/auth-user.repository'
// import mongoose from 'mongoose'

// @Injectable()
// export class UserGuard implements CanActivate {
//   private readonly logger = new Logger(UserGuard.name)
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly authUserRepository: AuthUserRepository,
//     private readonly userRepository: UserRepository,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const startTime = new Date().getTime()
//     const request: FastifyRequest = context.switchToHttp().getRequest()
//     const headers = request.headers

//     const acceptType = headers['accept-type'] as string
//     if (!acceptType || !ACCEPT_TYPE.includes(acceptType)) {
//       throw getThrowError(
//         [getText('cannot_get_type_of_application_access_the_system')],
//         HttpStatus.UNAUTHORIZED,
//       )
//     }

//     // Get language
//     const language = headers['accept-language'] as string
//     if (!language) {
//       throw getThrowError(
//         [
//           getText('please_enter_name', {
//             name: getText('language').toLocaleLowerCase(),
//           }),
//         ],
//         HttpStatus.UNAUTHORIZED,
//       )
//     }
//     if (language && !LANGUAGES.includes(language)) {
//       throw getThrowError(
//         [getText('language_is_not supported')],
//         HttpStatus.UNAUTHORIZED,
//       )
//     }

//     // Get token
//     const token = getToken(request)
//     if (!token) {
//       throw getThrowError(
//         [getText('you_dont_have_permission_to_access_data')],
//         HttpStatus.UNAUTHORIZED,
//       )
//     }
//     let userId
//     try {
//       // Get phone number from token
//       const payload = this.jwtService.verify(token)
//       // Get user auth id
//       userId = decrypt(payload.data)
//     } catch (e) {}

//     if (!userId) {
//       throw getThrowError(
//         [getText('you_dont_have_permission_to_access_data')],
//         HttpStatus.UNAUTHORIZED,
//       )
//     }
//     // Get data from database
//     let res
//     try {
//       let userObj = {}
//       userObj['_id'] = new mongoose.Types.ObjectId(userId)
//       userObj['active.value'] = true
//       res = await Promise.all([
//         this.authUserRepository.findOneBy({
//           token: token,
//         }),
//         this.userRepository.findOneBy(userObj),
//       ])

//       if (res[0] === null || res[1] === null) {
//         throw new HttpException({}, HttpStatus.UNAUTHORIZED)
//       }
//       // Attach USER
//       request['user'] = res[1]
//       const endTime = new Date().getTime()
//     } catch (e) {
//       throw getThrowError(
//         [getText('you_dont_have_permission_to_access_data')],
//         HttpStatus.UNAUTHORIZED,
//       )
//     }

//     return true
//   }
// }
