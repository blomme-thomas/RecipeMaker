import { IsEnum, IsString } from "class-validator";
import { Measure } from "src/ingredient/model/ingredient.interface";

export class CreateIngredientDto {
    @IsString()
    name: string;

    @IsEnum(Measure)
    measure: Measure;
}