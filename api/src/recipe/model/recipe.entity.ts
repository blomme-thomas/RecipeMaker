import { IngredientEntity } from "src/ingredient/model/ingredient.entity";
import { Ingredient } from "src/ingredient/model/ingredient.interface";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RecipeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column("text", { array: true, nullable: true })
    instructions: string[];

    @Column("text", { array: true, nullable: true })
    kitchenware: string[];

    @Column({ nullable: true })
    recipe_image: string;

    @ManyToMany(() => IngredientEntity, ingredient => ingredient.recipes)
    @JoinTable({ name: "recipe_ingredients" })
    ingredients: Ingredient[];
}