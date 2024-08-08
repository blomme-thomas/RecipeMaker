import { Ingredient } from "src/ingredient/model/ingredient.interface";

export interface Recipe {
    id?: number;
    name?: string;
    instructions?: string[];
    recipe_image?: string;
    ingredients?: Ingredient[];
}