import { Inject, Injectable, Logger } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { CONNECTIONS_PROVIDER } from 'src/constants/tokens';
import { getCurDabaseName } from 'src/helper/database';
import { User, UserSchema } from 'src/schema/user.schema';

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

  countUser() {
    let total = 0;
    for (const [key, value] of this.mapUserModel) {
    }
    return 0;
  }
}
