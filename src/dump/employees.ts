import { fakerVI } from '@faker-js/faker'
import { faker } from '@faker-js/faker'
import { Logger } from '@nestjs/common'
import { createI18nBool } from 'src/helper/i18nbool'
import { createI18nDate } from 'src/helper/i18ndate'
import { createI18nString, createI18nStringGender } from 'src/helper/i18nstring'

export const createEmployeeOrg = (user) => {
  const save = {
    code: '1',
    user: user,
    master: createI18nBool(true, 'creator_of_the_organization'),
    description: createI18nString('you_created_organization'),
    creator: null,
    active: createI18nBool(true, 'active'),
    branches: [],
    departments: [],
    positions: [],
    lastUpdater: null,
    startDateOfWork: createI18nDate(),
    endDateOfWork: null,
    createdAt: createI18nDate(),
    updatedAt: null,
  }
  return save
}

export const createEmployee = (code, user, org, creator, branches) => {
  let adjective = faker.word.adjective()
  let noun = faker.word.noun()
  let descriptionObj = {}
  descriptionObj['vi'] = `${noun} ${adjective}`
  const save = {
    code: code,
    org: org,
    user: user,
    master: createI18nBool(false, 'not_the_creator_of_the_organization'),
    description: descriptionObj,
    active: createI18nBool(true, 'active'),
    lastUpdater: null,
    creator: creator,
    branches: branches,
    departments: [],
    positions: [],
    createdAt: createI18nDate(),
    updatedAt: null,
    startDateOfWork: createI18nDate(),
    endDateOfWork: null,
  }
  return save
}
