import { Injectable, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getCacheError, getSuccess } from 'src/helper/helper';
import { Result } from 'src/types/common/result.type';
import { CreateType } from 'src/types/user/user.type';

@Injectable()
export class AuthService {
  /**
   * Sign up
   * @param response
   * @param request
   * @param params
   * @returns
   */
  async postSignUp(
    response: FastifyReply,
    request: FastifyRequest,
    params: CreateType,
  ): Promise<Result> {
    // const startTime = new Date().getTime();
    // const session = await this.mongoConnection.startSession();
    // session.startTransaction();
    // try {
    //   // Get type: ios, android, web;
    //   const headers = request.headers;
    //   const type = headers['accept-type'] as string;
    //   if (!type && !ACCEPT_TYPE.includes(type)) {
    //     throw getThrowError([
    //       getText('cannot_get_type_of_application_access_the_system'),
    //     ]);
    //   }
    //   const errors = await this.validateSignUp(params);
    //   if (errors && errors.length) {
    //     throw getThrowError(errors);
    //   }
    //   const language = getLanguage(request);
    //   // Encrpt password
    //   const pass = params.password;
    //   const saltRounds = 10; // Typically a value between 10 and 12
    //   const passCrypt = await bcrypt.hash(pass, saltRounds);
    //   params.password = passCrypt;
    //   const count = await this.userRepository.findUserCount();
    //   const code = count + 1;
    //   let dateOfBirth = null;
    //   if (params.dateOfBirth) {
    //     dateOfBirth = new Date(params.dateOfBirth);
    //   }
    //   const dateOfBirthObj = createI18nDate(dateOfBirth);
    //   let fullNameObj: any = {};
    //   fullNameObj[language] = params.fullName;
    //   // Create user
    //   const saveUser = {
    //     code: code,
    //     gender: createI18nStringGender(params.gender),
    //     phoneNumber: params.phoneNumber,
    //     fullName: fullNameObj,
    //     password: params.password,
    //     nickName: null,
    //     description: null,
    //     avatar: null,
    //     address: null,
    //     dateOfBirth: dateOfBirthObj,
    //     active: createI18nBool(true, 'active'),
    //     creditCards: [],
    //     orgs: [],
    //     createdAt: createI18nDate(),
    //     updatedAt: null,
    //   };
    //   const user = await this.userRepository.create(saveUser, session);
    //   // Create token
    //   const token = createToken(this.jwtService, user.id);
    //   const saveUserAuth = {
    //     type: type,
    //     user: user,
    //     token: token,
    //     createdAt: now(),
    //     updatedAt: now(),
    //   };
    //   const userAuth = await this.userAuthRepository.create(
    //     saveUserAuth,
    //     session,
    //   );
    //   await session.commitTransaction();
    //   session.endSession();
    //   const result = convertSignUp({
    //     auth: userAuth,
    //     user: user,
    //     orgs: [],
    //   });
    //   const endTime = new Date().getTime();
    //   Logger.log(`Auth postSignUp: ${endTime - startTime}`);
    //   return getSuccess(result);
    // } catch (e) {
    //   await session.abortTransaction();
    //   session.endSession();
    //   Logger.log('Error: Auth postSignUp');
    //   throw getCacheError(e);
    // }
    return getSuccess('OK');
  }
}
