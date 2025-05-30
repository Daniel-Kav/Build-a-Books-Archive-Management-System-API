import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  // 'unique' name to be handled in service layer or by DB constraint
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}