import { IsString, MinLength, MaxLength, IsOptional, MaxLength as MaxLengthBio, IsDateString, ValidateIf, IsBoolean } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLengthBio(1000) // Renamed to avoid conflict if IsString had MaxLength too
  bio?: string;

  @IsOptional()
  @IsDateString()
  // Custom validator needed for 'not in the future'
  birthDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}