import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { getConnProviders, getConnections } from 'src/helper/database';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWT } from 'src/helper/constants';

@Module({
  imports: [
    ...getConnections(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('KEY_JWT'),
        signOptions: { expiresIn: JWT.EXPIRES_IN },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, getConnProviders()],
})
export class AuthModule {}
