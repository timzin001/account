import { Prop } from '@nestjs/mongoose'

export class I18nString {
  @Prop({ required: false })
  en: string
  @Prop({ required: false })
  vi: string
  @Prop({ required: false })
  value: string
}
