import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Result } from 'src/types/common/result.type';
import { FastifyRequest } from 'fastify';
import { UAParser } from 'ua-parser-js';
import { USER_AGENT } from './constants';
import { encrypt } from './crypto';
import { JwtService } from '@nestjs/jwt';

/**
 * Get success
 * @param data
 * @param code
 * @returns
 */
export const getSuccess = (data: any, code: number = HttpStatus.OK): Result => {
  return new Result([], data, code);
};

/**
 * Get error
 * @param messages
 * @param code
 * @returns
 */
export const getCacheError = (
  e: any,
  code: number = HttpStatus.BAD_REQUEST,
): Result => {
  // e.response.messages;

  let messages = [];
  if (e.response && e.response.messages && e.response.messages.length) {
    messages = e.response.messages;
  } else {
    messages = [getText('error_occur_please_try_again')];
  }
  return new Result(messages, null, code);
};

/**
 * Get error
 * @param messages
 * @param code
 * @returns
 */
export const getError = (
  messages: string[],
  code: number = HttpStatus.BAD_REQUEST,
): Result => {
  return new Result(messages, null, code);
};

/**
 * Throw error
 * @param messages
 * @param code
 * @returns
 */
export const getThrowError = (
  messages: string[],
  code: number = HttpStatus.BAD_REQUEST,
): HttpException => {
  return new HttpException(
    {
      messages: messages,
      statuCode: code,
    },
    code,
  );
};

/**
 * Get text with multi languages
 * @param key
 * @returns
 */
export const getText = (
  key: string,
  args: any = null,
  lang: string = '',
): string => {
  let langKey = 'en';
  if (lang) {
    langKey = lang;
  } else {
    langKey = I18nContext.current().lang;
  }
  if (!args) {
    return I18nContext.current().t(`common.${key}`, {
      lang: langKey,
    });
  }
  return I18nContext.current().t(`common.${key}`, {
    lang: langKey,
    args: args,
  });
};

/**
 * Get text with multi languages
 * @param key
 * @returns
 */
export const getGWText = (key: string, i18nContext: I18nContext): string => {
  return i18nContext.t(`common.${key}`, {
    lang: i18nContext.lang,
  });
};

export const getHidePhone = (phoneNumber: string): string => {
  if (!phoneNumber) {
    return '';
  }
  const first = phoneNumber.substring(0, phoneNumber.length - 3);
  const last = phoneNumber.substring(
    phoneNumber.length - 3,
    phoneNumber.length,
  );
  let str = '';
  for (let index = 0; index < first.length; index++) {
    str = `${str}*`;
  }
  return `${str}${last}`;
};

/**
 * Build key
 * @param data
 * @returns
 */
export const buildKey = (data: Object) => {
  let key = Object.entries(data)
    .map(([key, value]) => `${key}_${value}`)
    .join('_');
  return key
    .replace(/[^a-zA-Z0-9 ]/g, '_')
    .replace(' ', '_')
    .toLowerCase();
};

/**
 * Create token
 * @param phone
 * @returns
 */
export const createToken = (jwtService: JwtService, id: string) => {
  // const objStr = encrypt(phone);
  const payload = {
    data: encrypt(id),
  };
  return jwtService.sign(payload);
};
/// Check email
export const isEmail = (data: any) => {
  return data.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

/// Check nick name
export const isNickName = (data: any) => {
  // letters (upper or lowercase)
  //numbers (0-9)
  // underscore (_)
  return data.match(/^[a-zA-Z0-9_]*$/);
};

export const createCode = (count: number, limit = 12) => {
  count = count + 1;
  let str = `${count}`;
  const len = str.length;
  for (let index = 0; index < limit - len; index++) {
    str = `0${str}`;
  }
  let code: string;
  for (let index = 0; index < limit; index = index + 3) {
    if (!code) {
      code = str.substring(0, index + 3);
    } else {
      code = `${code}-${str.substring(index, index + 3)}`;
    }
  }
  return code;
};

// Get token
export const getToken = (request: FastifyRequest) => {
  const [type, token] = request.headers?.authorization?.split(' ') ?? [];
  if (type === 'Bearer') {
    return token;
  }
  return '';
};

// export const getDataUserAgent = (request: FastifyRequest): any => {
//   const headers = request.headers;
//   const userAgent = headers[USER_AGENT];

//   const parser = new UAParser(userAgent);
//   const result = parser.getResult();
//   const value = headers['x-real-ip'];

//   let ipValue = null;
//   if (Array.isArray(value) && value.length) {
//     ipValue = String(value[0]);
//   } else {
//     ipValue = String(value);
//   }
//   if (ipValue === '::1') {
//     ipValue = '8:8:8:8';
//   }
//   /* Hardcode: will be delete after finish */
//   if (!userAgent || userAgent.includes('PostmanRuntime')) {
//     return {
//       ip: ipValue,
//       os: 'Mac OS',
//       device: 'Computer',
//       browser: 'browser',
//     };
//   }
//   return {
//     ip: ipValue,
//     os: result.os.name,
//     device: detectDevice(result.device),
//     browser: result.browser.name,
//   };
// };

// /**
//  * Detect device connect to website
//  * @param device
//  * @returns
//  */
// export const detectDevice = (device: any): string => {
//   if (device && device.type === 'mobile') {
//     return 'mobile';
//   }
//   if (device && device.type === 'tablet') {
//     return 'tablet';
//   }
//   return 'computer';
// };

/**
 * Check data is number
 * @param {*} data
 * @returns
 */
export const isInteger = (data) => {
  var er = /^-?[0-9]+$/;
  return er.test(data);
};

/**
 * Check data is number
 * @param {*} data
 * @returns
 */
export const isNumber = (data) => {
  const value = parseFloat(`${data}`);
  if (isNaN(value)) {
    return false;
  }
  return true;
};

/**
 * Check data has value
 * @param {*} data
 * @returns
 */
export const hasValue = (data) => {
  if (data != undefined && data != null) {
    return true;
  }
  return false;
};

/// Check object
export const isObject = (obj: any) => {
  if (typeof obj === 'object') {
    return true;
  }
  false;
};

/// Check empty object
export const isEmptyObject = (obj: any) => {
  if (typeof obj !== 'object') {
    return false;
  }
  return Object.keys(obj).length === 0;
};

/// Get language
export const getLanguage = (request: FastifyRequest) => {
  const headers = request.headers;
  const language = headers['accept-language'] as string;
  return language;
};

/// 1: Phone number is not number
/// 2: Phone number is not correct format
/// 0: Is ok
export const validatePhoneNumber = (phoneNumber: string) => {
  /// (+84) 123456789
  /// (+65) 12345678
  if (phoneNumber) {
    let arr = phoneNumber.split(')');
    const realVal = arr[1];

    const number = Number(realVal);
    if (!Number.isInteger(number)) {
      return 1;
    }

    /// Follow pattern
    if (arr[0] === '(+65') {
      if (arr[1].length !== 8) {
        return 2;
      }
    } else if (arr[0] === '(+84') {
      if (arr[1].length !== 9) {
        return 2;
      }
    }
  }
  return 0;
};
