import { getText } from './helper'
export const createI18nStringGender = (value: string) => {
  if (!value) {
    return {
      vi: getText('other', null, 'vi'),
      en: getText('other', null, 'en'),
      value: 'other',
    }
  }
  if (!value || (value != 'male' && value != 'female' && value != 'other')) {
    return {
      vi: getText('other', null, 'vi'),
      en: getText('other', null, 'en'),
      value: 'other',
    }
  }
  return {
    vi: getText(value, null, 'vi'),
    en: getText(value, null, 'en'),
    value: value,
  }
}

export const createI18nString = (value: string) => {
  return {
    vi: getText(value, null, 'vi'),
    en: getText(value, null, 'en'),
    value: value,
  }
}
