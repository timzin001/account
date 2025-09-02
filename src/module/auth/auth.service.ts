import { Inject, Injectable, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ClientSession, Connection, Model, now } from 'mongoose';
import { CONNECTIONS_PROVIDER } from 'src/constants/tokens';
import { ACCEPT_TYPE } from 'src/helper/constants';
import { getCurDabaseName, getDabaseName } from 'src/helper/database';
import {
  createToken,
  getCacheError,
  getLanguage,
  getSuccess,
  getText,
  getThrowError,
  validatePhoneNumber,
} from 'src/helper/helper';
import { Result } from 'src/types/common/result.type';
import {
  SignUpType,
  ResultCreateType,
  SignInType,
} from 'src/types/user/user.type';
import * as bcrypt from 'bcrypt';
import { createI18nDate } from 'src/helper/i18ndate';
import { createI18nStringGender } from 'src/helper/i18nstring';
import { createI18nBool } from 'src/helper/i18nbool';
import { JwtService } from '@nestjs/jwt';
import { Auth, AuthSchema } from 'src/schema/auth.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Injectable()
export class AuthService {
  private readonly mapAuthModel: Map<string, Model<Auth>> = new Map();
  private readonly mapUserModel: Map<string, Model<User>> = new Map();
  private curDatabaseName: string = '';

  constructor(
    @Inject(CONNECTIONS_PROVIDER)
    private readonly connections: Map<string, Connection>,
    private readonly jwtService: JwtService,
  ) {
    this.curDatabaseName = getCurDabaseName();
    for (const [key, value] of connections) {
      Logger.log(`${key}: ${value}`);
      const conn = this.connections.get(key);

      const authModel = conn.model(Auth.name, AuthSchema);
      this.mapAuthModel.set(key, authModel);

      const userModel = conn.model(User.name, UserSchema);
      this.mapUserModel.set(key, userModel);
    }
  }

  async countAllUser() {
    let total = 0;
    let listRequest = [];
    for (const [key, value] of this.mapUserModel) {
      let request = value.countDocuments();
      listRequest.push(request);
    }
    const listResult = await Promise.all(listRequest);
    listResult.forEach((item) => {
      total += item;
    });
    return total;
  }

  async findOneAuth(obj) {
    let listRequest = [];
    for (const [key, value] of this.mapAuthModel) {
      let find = value.findOne(obj);
      let request = find.exec();
      listRequest.push(request);
    }

    const listResult = await Promise.all(listRequest);
    let filter = listResult.filter((item) => {
      if (item) {
        return true;
      }
      return false;
    });
    if (!filter.length) {
      return;
    }
    return filter[0];
  }

  async findOneUser(obj: any) {
    let listRequest = [];
    for (const [key, value] of this.mapUserModel) {
      let find = value.findOne(obj);
      let request = find.exec();
      listRequest.push(request);
    }

    const listResult = await Promise.all(listRequest);
    let filter = listResult.filter((item) => {
      if (item) {
        return true;
      }
      return false;
    });
    if (!filter.length) {
      return;
    }
    return filter[0];
  }

  async postSignUp(
    request: FastifyRequest,
    params: SignUpType,
  ): Promise<Result> {
    const startTime = new Date().getTime();
    const currDatabaseName = getCurDabaseName();
    const connnection = this.connections.get(currDatabaseName);
    const session = await connnection.startSession();
    session.startTransaction();
    try {
      // Get type: ios, android, web;
      const headers = request.headers;
      const type = headers['accept-type'] as string;
      if (!type && !ACCEPT_TYPE.includes(type)) {
        throw getThrowError([
          getText('cannot_get_type_of_application_access_the_system'),
        ]);
      }
      const errors = await this.validateSignUp(params);
      if (errors && errors.length) {
        throw getThrowError(errors);
      }
      const language = getLanguage(request);
      // Encrpt password
      const pass = params.password;
      const saltRounds = 10; // Typically a value between 10 and 12
      const passCrypt = await bcrypt.hash(pass, saltRounds);
      params.password = passCrypt;
      const currUserModel = this.mapUserModel.get(this.curDatabaseName);
      const count = await this.countAllUser();

      const code = count + 1;
      let dateOfBirth = null;
      if (params.dateOfBirth) {
        dateOfBirth = new Date(params.dateOfBirth);
      }
      const dateOfBirthObj = createI18nDate(dateOfBirth);
      let fullNameObj: any = {};
      fullNameObj[language] = params.fullName;
      // Create user
      const saveUser = {
        code: code,
        gender: createI18nStringGender(params.gender),
        phoneNumber: params.phoneNumber,
        fullName: fullNameObj,
        password: params.password,
        nickName: null,
        description: null,
        avatar: null,
        address: null,
        dateOfBirth: dateOfBirthObj,
        active: createI18nBool(true, 'active'),
        orgs: [],
        createdAt: createI18nDate(),
        updatedAt: null,
      };
      const newUser = new currUserModel(saveUser);
      const user = await newUser.save({ session });

      // Create token
      const token = createToken(this.jwtService, user.id);
      const saveAuth = {
        type: type,
        user: user,
        token: token,
        createdAt: now(),
        updatedAt: now(),
      };
      const currAuthModel = this.mapAuthModel.get(this.curDatabaseName);
      const newAuth = new currAuthModel(saveAuth);
      const auth = await newAuth.save({ session });
      await session.commitTransaction();
      session.endSession();
      const result = ResultCreateType({
        auth: auth,
        user: user,
        orgs: [],
      });

      const endTime = new Date().getTime();
      Logger.log(`Auth postSignUp: ${endTime - startTime}`);
      return getSuccess(result);
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      Logger.log('Error: Auth postSignUp');
      throw getCacheError(e);
    }
  }

  /**
   * Validate field before sign up
   * @param param
   * @returns
   */
  async validateSignUp(param: SignUpType): Promise<string[]> {
    let result: string[] = [];

    /// Phone number
    if (!param.phoneNumber) {
      result.push(
        getText('please_enter_name', {
          name: getText('phone_number').toLocaleLowerCase(),
        }),
      );
    }

    /// (+84) 123456789
    /// (+65) 12345678
    if (param.phoneNumber) {
      let valphoneNumber = validatePhoneNumber(param.phoneNumber);
      if (valphoneNumber == 1) {
        result.push(
          getText('name_only_contains_digits', {
            name: getText('phone_number'),
          }),
        );
      } else if (valphoneNumber === 2) {
        result.push(
          getText('name_is_not_correct_format', {
            name: getText('phone_number'),
          }),
        );
      }
    }

    // /// Check phone number in database
    const resUser = await this.findOneUser({ phoneNumber: param.phoneNumber });

    if (resUser) {
      result.push(getText('this_phone_number_has_account_in_system'));
    }

    /// Password
    if (!param.password) {
      result.push(
        getText('please_enter_name', {
          name: getText('password').toLocaleLowerCase(),
        }),
      );
    }
    if (param.password && param.password.length < 9) {
      result.push(
        getText('nam1_must_be_greater_than_name2_characters', {
          name1: getText('password'),
          name2: 8,
        }),
      );
    }
    if (param.password && param.password.length > 20) {
      result.push(
        getText('nam1_must_be_less_than_nam2_characters', {
          nam1: getText('password'),
          name2: 20,
        }),
      );
    }

    if (param.password && !/[a-z]/.test(param.password)) {
      result.push(
        getText('name_must_have_a_lowercase_letter', {
          nam: getText('password'),
        }),
      );
    }
    if (param.password && !/[A-Z]/.test(param.password)) {
      result.push(
        getText('name_must_have_a_uppercase_letter', {
          nam: getText('password'),
        }),
      );
    }

    if (param.password && !/\d/.test(param.password)) {
      result.push(
        getText('name_must_have_a_number', { name: getText('password') }),
      );
    }

    /// Full name
    if (!param.fullName) {
      result.push(
        getText('please_enter_name', {
          name: getText('full_name').toLocaleLowerCase(),
        }),
      );
    }
    if (param.fullName && param.fullName.length < 6) {
      result.push(
        getText('nam1_must_be_greater_than_name2_characters', {
          name1: getText('full_name'),
          name2: 6,
        }),
      );
    }
    /// Gender
    if (!param.gender) {
      result.push(
        getText('please_select_name', {
          name: getText('gender').toLocaleLowerCase(),
        }),
      );
    }
    if (
      !param.gender ||
      (param.gender != 'male' &&
        param.gender != 'female' &&
        param.gender != 'other')
    ) {
      result.push(
        getText('name_is_not_correct_format', { name: getText('gender') }),
      );
    }
    /// Birthday
    if (!param.dateOfBirth) {
      result.push(
        getText('please_select_name', {
          name: getText('date_of_birth').toLocaleLowerCase(),
        }),
      );
    }

    const date = Date.parse(param.dateOfBirth);
    if (isNaN(date)) {
      result.push(
        getText('name_is_not_correct_format', {
          name: getText('date_of_birth'),
        }),
      );
    }

    return result;
  }

  /**
   * Sign in
   * @param response
   * @param request
   * @param params
   * @returns
   */
  async postSignIn(
    response: FastifyReply,
    request: FastifyRequest,
    params: SignInType,
  ): Promise<Result> {
    const startTime = new Date().getTime();
    let session;
    try {
      // Get type: ios, android, web;
      const headers = request.headers;
      const type = headers['accept-type'] as string;
      // Get user phone
      // Phone (+84)974318066
      let user = await this.findOneUser({
        phoneNumber: params.phoneNumber,
        'active.value': true,
      });

      // Validate
      const errors = await this.validateSignIn(params, user, type);
      if (!errors || errors.length) {
        throw getThrowError(errors);
      }

      const dbName = getDabaseName(user.createdAt.value);
      const connect = this.connections.get(dbName);
      session = await connect.startSession();
      session.startTransaction();

      const auth = await this.getInfoPersonal(dbName, type, user, session);
      await session.commitTransaction();
      session.endSession();
      const result = {
        auth: auth,
        user: user,
      };
      const endTime = new Date().getTime();
      Logger.log(`Auth postSignIn: ${endTime - startTime}`);
      return getSuccess(result);
    } catch (e) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      Logger.log('Error: Auth postSignIn');
      throw getCacheError(e);
    }
  }

  /**
   * Validate sign in
   * @param param
   * @returns
   */
  async validateSignIn(
    param: SignInType,
    foundUser: any,
    type: string,
  ): Promise<string[]> {
    let result: string[] = [];

    if (!type || !ACCEPT_TYPE.includes(type)) {
      result.push(getText('cannot_get_type_of_application_access_the_system'));
    }

    if (!param.phoneNumber) {
      result.push(
        getText('please_enter_name', {
          name: getText('phone_number').toLocaleLowerCase(),
        }),
      );
    }
    if (param.phoneNumber) {
      let arr = param.phoneNumber.split(')');
      const realVal = arr[1];

      const number = Number(realVal);
      if (!Number.isInteger(number)) {
        result.push(
          getText('name_only_contains_digits', {
            name: getText('phone_number'),
          }),
        );
      }

      if (realVal.length < 6) {
        result.push(
          getText('name1_must_be_greater_than_or_equal_name2_characters', {
            name1: getText('phone_number'),
            name2: 6,
          }),
        );
      }
      if (realVal.length > 15) {
        result.push(
          getText('name1_cannot_be_more_than_name2_characters', {
            name1: getText('phone_number'),
            name2: 6,
          }),
        );
      }
    }

    if (!param.password) {
      result.push(
        getText('please_enter_name', {
          name: getText('password').toLocaleLowerCase(),
        }),
      );
    }
    if (param.password && param.password.length < 8) {
      result.push(
        getText('name1_must_be_greater_than_name2_characters', {
          name1: getText('password'),
          name2: 8,
        }),
      );
    }

    if (!foundUser) {
      result.push(
        getText('name_is_not_exist_in_system', { name: getText('account') }),
      );
    }

    if (foundUser) {
      const isMatch = await bcrypt.compare(param.password, foundUser.password);
      if (!isMatch) {
        result.push(
          getText('name_is_not_correct', { name: getText('password') }),
        );
      }
    }

    return result;
  }

  async getInfoPersonal(
    dbName: string,
    type: string,
    user: any,
    session: ClientSession,
  ): Promise<any> {
    // Get user auth
    let findUserAuth: any = await this.findOneAuth({
      user: user,
      type: type,
    });

    const authModel = this.mapAuthModel.get(dbName);

    // Create token
    const token = createToken(this.jwtService, `${user._id}`);
    if (!findUserAuth) {
      const data = {
        type: type,
        user: user,
        token: token,
        createdAt: now(),
        updatedAt: now(),
      };

      const newAuth = new authModel(data);
      const auth = await newAuth.save({ session });
      return auth;
    }
    const auth = await authModel.updateOne(
      { _id: findUserAuth._id },
      { $set: { token: token, updatedAt: now() } },
    );

    findUserAuth.token = token;
    findUserAuth.updatedAt = now();

    return findUserAuth;
  }
}
