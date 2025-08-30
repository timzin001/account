import { now } from 'mongoose'
import * as moment from 'moment'
export const createI18nDate = (value: NativeDate = null) => {
  let date = value
  if (!value) {
    date = now()
  }
  const dateValue = moment.utc(date).local()
  const i18nDate = {
    value: date,
    en: dateValue.format('YYYY/MM/DD HH:mm:ss'),
    vi: dateValue.format('DD/MM/YYYY HH:mm:ss'),
  }
  return i18nDate
}
