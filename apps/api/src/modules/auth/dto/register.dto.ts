import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'sherlock@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'takparani123',
    minLength: 6,
    maxLength: 32,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
