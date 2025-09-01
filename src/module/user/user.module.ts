import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { getConnections, getConnProviders } from 'src/helper/database';

@Module({
  imports: [...getConnections()],
  controllers: [UserController],
  providers: [UserService, getConnProviders()],
})
export class UserModule {}
