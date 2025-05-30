import { IsString, MinLength, MaxLength, IsEmail, Matches, IsOptional, IsBoolean, IsAlphanumeric } from 'class-validator';

const nameRegex = /^[a-zA-Z0-9 ]*$/; // Alphanumeric with spaces

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(nameRegex, { message: 'Name must be alphanumeric with spaces' }) // Custom regex or IsAlphanumeric if spaces not allowed by it
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  // Add @IsUnique or similar custom validator later if needed for 'unique' email constraint check via DB
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