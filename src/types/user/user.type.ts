import { ApiProperty } from '@nestjs/swagger';

export class CreateType {
  @ApiProperty({
    description: 'phoneNumber',
    example: '1234567890',
  })
  phoneNumber: string;
  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  password: string;
  @ApiProperty({
    description: 'fullname',
    example: 'NGUYEN VAN A',
  })
  fullName: string;

  @ApiProperty({
    description: 'other',
    example: 'other',
  })
  gender: string;

  @ApiProperty({
    description: 'dateOfBirth',
    example: '2000-10-10',
  })
  dateOfBirth: string;
}

export const ResultCreateType = (data: any) => {
  const resAuth = data.auth.token;
  const user = data.user;
  const resOrgs: any = [];
  return { auth: resAuth, user: user, orgs: resOrgs };
};
