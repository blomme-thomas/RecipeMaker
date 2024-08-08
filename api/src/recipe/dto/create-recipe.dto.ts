import { IsString } from "class-validator";

export class CreateRecipeDto {
    @IsString()
    name: string;
}