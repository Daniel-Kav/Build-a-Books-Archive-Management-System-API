import { IsString, MinLength } from "class-validator";

// src/profiles/dto/create-profile.dto.ts
export class CreateProfileDto {
    @IsString()
    @MinLength(1)
    bio?: string; 
    @IsString()
    avatar?: string; 
    @IsString()
    dateOfBirth?: Date; 
    @IsString()
    location?: string; 
    // userId will likely come from the route or authenticated user, not the payload
  }
  