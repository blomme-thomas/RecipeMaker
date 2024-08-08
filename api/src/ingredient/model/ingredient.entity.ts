import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Measure } from "./ingredient.interface";
import { RecipeEntity } from "src/recipe/model/recipe.entity";
import { Recipe } from "src/recipe/model/recipe.interface";

@Entity()
export class IngredientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'enum', enum: Measure, default: Measure.AMOUNT })
    measure: Measure;

    @Column({ nullable: true })
    ingredient_image: string;

    @ManyToMany(() => RecipeEntity, recipe => recipe.ingredients)
    recipes: Recipe[]
}