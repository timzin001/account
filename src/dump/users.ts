import { fakerVI } from '@faker-js/faker';
import { faker } from '@faker-js/faker';
import { Logger } from '@nestjs/common';
import { createI18nBool } from 'src/helper/i18nbool';
import { createI18nDate } from 'src/helper/i18ndate';
import { createI18nStringGender } from 'src/helper/i18nstring';

export const createUser = (code, passCrypt) => {
  let phoneNumber = faker.string.numeric({ length: 9 });
  phoneNumber = `(+84)${phoneNumber}`;

  let fullNameText = fakerVI.person.fullName();
  let fullNameObj = { en: fullNameText, vi: fullNameText };

  let genderText = faker.helpers.arrayElement(['male', 'female']);

  let genderObj = createI18nStringGender(genderText);

  let dateOfBirth = faker.date.past();
  const dateOfBirthObj = createI18nDate(dateOfBirth);

  const adjective = faker.word.adjective(); // Ví dụ: 'brave'
  const noun = faker.word.noun(); // Ví dụ: 'dragon'
  const nickName = `${adjective}${noun}`;
  // Logger.log(fullNameText)
  const saveUser = {
    code: code,
    gender: genderObj,
    phoneNumber: phoneNumber,
    fullName: fullNameObj,
    password: passCrypt,
    nickName: nickName,
    description: null,
    avatar: null,
    address: null,
    dateOfBirth: dateOfBirthObj,
    active: createI18nBool(true, 'active'),
    creditCards: [],
    orgs: [],
    createdAt: createI18nDate(),
    updatedAt: null,
  };

  return saveUser;
};
