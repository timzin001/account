import {
  Controller,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { UserGuard } from 'src/helper/user.guard';
import { AuthGuardLang } from 'src/helper/guard.lang';
import { Result } from 'src/types/common/result.type';
import { FastifyReply, FastifyRequest } from 'fastify';
// import { CreateType, SignIn, SignInOrg } from '../../types/user/auth.type';
import { getSuccess } from 'src/helper/helper';
import { CreateType } from 'src/types/user/user.type';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  // @HttpCode(HttpStatus.OK)
  // @Post('post-sign-in')
  // @ApiOperation({ summary: 'API: Sign in' })
  // @ApiResponse({ status: 200, description: 'OK' })
  // @ApiResponse({ status: 400, description: 'Error' })
  // @ApiHeader({
  //   name: 'Accept-Language',
  //   description: 'Select languages',
  //   required: true,
  //   schema: { type: 'string', default: 'vi' },
  // })
  // @UseGuards(AuthGuardLang)
  // async postSignIn(
  //   @Res({ passthrough: true }) response: FastifyReply,
  //   @Req() request: FastifyRequest,
  //   @Body() signInDto: SignIn,
  // ): Promise<Result> {
  //   return await this.authService.postSignIn(response, request, signInDto);
  // }

  @HttpCode(HttpStatus.OK)
  @Post('post-sign-up')
  @ApiOperation({ summary: 'API: Sign up' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Error' })
  @ApiHeader({
    name: 'Accept-Language',
    description: 'Select languages',
    required: true,
    schema: { type: 'string', default: 'vi' },
  })
  // @UseGuards(AuthGuardLang)
  async postSignUp(
    @Res({ passthrough: true }) response: FastifyReply,
    @Req() request: FastifyRequest,
    @Body() params: CreateType,
  ): Promise<Result> {
    return await this.authService.postSignUp(request, params);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('post-sign-out')
  // @ApiOperation({ summary: 'API: Sign out.' })
  // @ApiResponse({ status: 200, description: 'OK' })
  // @ApiResponse({ status: 400, description: 'Error' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @ApiHeader({
  //   name: 'Accept-Language',
  //   description: 'Select languages',
  //   required: true,
  //   schema: { type: 'string', default: 'vi' },
  // })
  // @UseGuards(UserGuard)
  // async postSignOut(
  //   @Res({ passthrough: true }) response: FastifyReply,
  //   @Req() request: FastifyRequest,
  // ): Promise<Result> {
  //   return await this.authService.postSignOut(response, request);
  // }

  // @HttpCode(HttpStatus.OK)
  // @Get('verify')
  // @ApiOperation({ summary: 'API: Verify.' })
  // @ApiResponse({ status: 200, description: 'OK' })
  // @ApiResponse({ status: 400, description: 'Error' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // @ApiHeader({
  //   name: 'Accept-Language',
  //   description: 'Select languages',
  //   required: true,
  //   schema: { type: 'string', default: 'vi' },
  // })
  // @UseGuards(UserGuard)
  // async verify(
  //   @Res({ passthrough: true }) response: FastifyReply,
  //   @Req() request: FastifyRequest,
  // ): Promise<Result> {
  //   return await this.authService.verify(response, request);
  // }
}
