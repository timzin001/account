import { fakerVI } from '@faker-js/faker'
import { faker } from '@faker-js/faker'
import { Logger } from '@nestjs/common'
import { createI18nBool } from 'src/helper/i18nbool'
import { createI18nDate } from 'src/helper/i18ndate'
import { createI18nStringGender } from 'src/helper/i18nstring'

export const createOrg = (code, user) => {
  let adjective = faker.word.adjective()
  let noun = faker.word.noun()
  let nameObject = {}
  nameObject['vi'] = `${noun} ${adjective}`
  let sloganObject = {}
  adjective = faker.word.adjective()
  noun = faker.word.noun()
  sloganObject['vi'] = `${noun} ${adjective}`
  let fieldObject = {}
  adjective = faker.word.adjective()
  noun = faker.word.noun()
  fieldObject['vi'] = `${noun} ${adjective}`
  let descrpitionObject = {}
  adjective = faker.word.adjective()
  noun = faker.word.noun()
  descrpitionObject['vi'] = `${noun} ${adjective}`
  const org = {
    code: code,
    name: nameObject,
    slogan: sloganObject,
    fields: fieldObject,
    size: code,
    description: descrpitionObject,
    status: createI18nBool(true, 'active'),
    avatar: null,
    lastUpdater: null,
    creator: null,
    active: createI18nBool(true, 'active'),
    users: [user],
    branchs: [],
    employees: [],
    departments: [],
    createdAt: createI18nDate(),
    updatedAt: null,
  }
  return org
}
