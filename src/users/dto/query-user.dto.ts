import { IsEmail, IsString, IsOptional } from 'class-validator';
export class QueryUserDto {
  @IsEmail()
  @IsOptional()
  email: string;
  @IsString()
  @IsOptional()
  password: string;
}
