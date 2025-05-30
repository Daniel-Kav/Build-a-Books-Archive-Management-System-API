import { IsString, MinLength, MaxLength, IsInt, Min, Max, IsOptional, IsBoolean, IsUUID, IsArray } from 'class-validator';
import { Type } from 'class-transformer'; // For type conversion

export class CreateBookDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear()) // Current year
  @Type(() => Number) // Ensures transformation from string if needed
  publicationYear: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsUUID()
  authorId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true }) // Validate each element in the array as a UUID v4
  categoryIds?: string[];
}