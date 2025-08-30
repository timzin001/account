import { getText } from './helper'
export const createI18nBool = (value: boolean, key: string) => {
  const i18nBool = {
    value: value,
    en: getText(key, null, 'en'),
    vi: getText(key, null, 'vi'),
  }
  return i18nBool
}
