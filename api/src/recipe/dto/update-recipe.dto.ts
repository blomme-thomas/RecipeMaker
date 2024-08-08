import { PartialType } from "@nestjs/mapped-types";
import { CreateRecipeDto } from "./create-recipe.dto";
import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
    @IsOptional()
    @IsArray()
    instructions: string[];

    @IsOptional()
    @IsString()
    recipe_image: string;
}