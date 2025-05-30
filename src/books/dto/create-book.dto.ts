import { IsString, MinLength, MaxLength, IsInt, IsOptional, IsBoolean, IsUUID, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { IsYearInRange } from '../../common/validators/is-year-in-range.validator';

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
  @IsYearInRange({ message: 'publicationYear must be between 1000 and the current year' })
  @Type(() => Number)
  publicationYear: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsUUID()
  authorId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}