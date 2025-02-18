import { IsString, IsOptional, IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Ingredient } from '../entities/recipe.entity';

export class CreateRecipeDto {
  @IsUUID() // Ensures user_id is a valid UUID (adjust if using number IDs)
  userId: string; // If user IDs are numbers, change to 'number'

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  ingredients: Ingredient[];

  @IsString()
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  tips?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true }) // Ensures each item in the array is a string
  inspirationLinks?: string[];
}
