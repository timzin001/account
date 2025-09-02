import { Inject, Injectable, Logger } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Connection, Model } from 'mongoose';
import { CONNECTIONS_PROVIDER } from 'src/constants/tokens';
import { getCurDabaseName, getDabaseName } from 'src/helper/database';
import { User, UserSchema } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { getSuccess } from 'src/helper/helper';
import { createUser } from 'src/dump/users';
import { Result } from 'src/types/common/result.type';

@Injectable()
export class UserService {
  private readonly mapUserModel: Map<string, Model<User>> = new Map();
  private curDatabaseName: string = '';

  constructor(
    @Inject(CONNECTIONS_PROVIDER)
    private readonly connections: Map<string, Connection>,
  ) {
    this.curDatabaseName = getCurDabaseName();
    for (const [key, value] of connections) {
      Logger.log(`${key}: ${value}`);
      const conn = this.connections.get(key);

      const userModel = conn.model(User.name, UserSchema);
      this.mapUserModel.set(key, userModel);
    }
  }

  async getListUsers(request: FastifyRequest) {
    let listRequest = [];
    for (const [key, value] of this.mapUserModel) {
      listRequest.push(value.find().skip(0).limit(10).exec());
    }
    let result = await Promise.all(listRequest);
    return getSuccess(result);
  }

  countUser() {
    let total = 0;
    for (const [key, value] of this.mapUserModel) {
    }
    return 0;
  }

  async dumUser(request: FastifyRequest): Promise<Result> {
    let password = '123456aA@';
    const saltRounds = 10; // Typically a value between 10 and 12
    const passCrypt = await bcrypt.hash(password, saltRounds);
    let listRes = [];

    let mapName: Map<number, string> = new Map();
    mapName.set(0, 'account_2015');
    mapName.set(1, 'account_2016');
    mapName.set(2, 'account_2017');
    mapName.set(3, 'account_2018');
    mapName.set(4, 'account_2019');
    mapName.set(5, 'account_2020');
    mapName.set(6, 'account_2021');
    mapName.set(7, 'account_2022');
    mapName.set(8, 'account_2023');
    mapName.set(9, 'account_2024');
    mapName.set(10, 'account_2025');

    for (let par = 0; par < 100; par++) {
      for (let index = 0; index < 11; index++) {
        // for (let index = 0; index < 1; index++) {
        let dbName = mapName.get(index);
        const model = this.mapUserModel.get(dbName);
        let result = this.partDumUser(
          model,
          passCrypt,
          index * 100,
          index * 100 + 100,
        );
        listRes.push(result);
      }
      Promise.all(listRes);
    }
    return getSuccess('Ok');
  }
  async partDumUser(model, passCrypt, offset, limit) {
    // Logger.log(`partDumUser ${offset} - ${limit}`);
    let request: any = [];
    for (let index = offset; index < limit; index++) {
      const user = createUser(index + 1, passCrypt);
      // const result = this.userRepository.createNoSession(user);
      const newUser = new model(user);
      request.push(newUser.save());
    }
    await Promise.all(request);
  }
}
