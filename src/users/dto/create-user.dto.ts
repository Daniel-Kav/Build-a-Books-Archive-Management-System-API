import { IsString, MinLength, MaxLength, IsEmail, Matches, IsOptional, IsBoolean } from 'class-validator';
import { IsAlphanumericWithSpaces } from '../../common/validators/is-alphanumeric-with-spaces.validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsAlphanumericWithSpaces({ message: 'Name must be alphanumeric with spaces' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  // Unique email handled at DB/service level
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}