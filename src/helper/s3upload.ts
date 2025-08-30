import { S3 } from 'aws-sdk'
import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import FastifyMulter from 'fastify-multer'
import { Options, Multer } from 'multer'

type MultipleInstance = any
export function MultipleMediaInterceptor(
  fieldName: string,
  maxCount?: number,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MultipleInstance

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS')
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({ ...options })
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp()

      await new Promise<void>((resolve, reject) =>
        this.multer.array(fieldName, maxCount)(
          ctx.getRequest(),
          ctx.getResponse(),
          (error: any) => {
            if (error) {
              return reject(error)
            }
            resolve()
          },
        ),
      )

      return next.handle()
    }
  }
  const Interceptor = mixin(MixinInterceptor)
  return Interceptor as Type<NestInterceptor>
}

type SingleInstance = any

export function SingleMediaInterceptor(
  fieldName: string,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: SingleInstance

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS')
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({ ...options })
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp()

      await new Promise<void>((resolve, reject) =>
        this.multer.single(fieldName)(
          ctx.getRequest(),
          ctx.getResponse(),
          (error: any) => {
            if (error) {
              // const error = transformException(err);
              return reject(error)
            }
            resolve()
          },
        ),
      )

      return next.handle()
    }
  }
  const Interceptor = mixin(MixinInterceptor)
  return Interceptor as Type<NestInterceptor>
}

/**
 * Upload file
 * @param file
 * @returns
 */
export const uploadToS3 = async (file) => {
  try {
    const s3 = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY,
      },
    })
    const { originalname, mimetype } = file
    const newFileName = `${Date.now().toString()}.${mimetype.split('/')[1]}`

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: newFileName,
      Body: file.buffer,
    }
    return new Promise((resolve, reject) => {
      s3.upload(params, {}, (err, data: any) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          data.OriginalName = originalname
          data.MimeType = mimetype
          resolve(data)
        }
      })
    })
  } catch (e) {
    console.log(e)
  }
}
