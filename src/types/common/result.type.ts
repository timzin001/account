import { HttpStatus } from '@nestjs/common';

export class Result {
  messages: string[];
  data: any;
  statusCode: number;
  constructor(msg: string[], val: any, code: number) {
    this.messages = msg;
    this.data = val;
    this.statusCode = code;
  }

  status() {
    if (
      this.statusCode == HttpStatus.OK ||
      this.statusCode === HttpStatus.ACCEPTED ||
      this.statusCode === HttpStatus.CREATED
    ) {
      return true;
    }
    return false;
  }
}

export class ListPaging {
  list: any;
  total: number;
  limit: number;
  offset: number;

  constructor(list: any, total: number, offset: number, limit: number) {
    this.list = list;
    this.total = total;
    this.limit = limit;
    this.offset = offset;
  }
}
