import { fakerVI } from '@faker-js/faker'
import { faker } from '@faker-js/faker'
import { Logger } from '@nestjs/common'
import { createI18nBool } from 'src/helper/i18nbool'
import { createI18nDate } from 'src/helper/i18ndate'
import { createI18nString, createI18nStringGender } from 'src/helper/i18nstring'

export const createBrancOrg = (org, emp) => {
  let adjective = faker.word.adjective()
  let noun = faker.word.noun()
  let nameObject = {}
  nameObject['vi'] = `${noun} ${adjective}`
  let addressObject = {}
  adjective = faker.word.adjective()
  noun = faker.word.noun()
  addressObject['vi'] = `${noun} ${adjective}`
  let descriptionObject = {}
  adjective = faker.word.adjective()
  noun = faker.word.noun()
  descriptionObject['vi'] = `${noun} ${adjective}`
  noun = faker.word.noun()
  let email = `${noun}@mail.com`

  let phoneNumber = faker.string.numeric({ length: 9 })
  phoneNumber = `(+84)${phoneNumber}`
  const save = {
    org: org,
    name: nameObject,
    address: addressObject,
    isMain: createI18nBool(true, 'main_branch'),
    email: email,
    phoneNumber: phoneNumber,
    description: descriptionObject,
    lastUpdater: null,
    active: createI18nBool(true, 'active'),
    creator: emp,
    avatar: null,
    employees: [],
    managers: [emp],
    createdAt: createI18nDate(),
    updatedAt: null,
  }
  return save
}
