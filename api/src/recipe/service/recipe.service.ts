import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from '../model/recipe.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Recipe } from '../model/recipe.interface';
import { from, map, Observable, switchMap } from 'rxjs';
import { Ingredient } from 'src/ingredient/model/ingredient.interface';

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(RecipeEntity)
        private readonly recipeRepository: Repository<RecipeEntity>,
    ) {}

    create(recipe: Recipe): Observable<Recipe> {
        return from(this.recipeRepository.save(recipe)).pipe(
            map((recipe: Recipe) => {
                return recipe;
            })
        );
    }

    findAll(): Observable<Recipe[]> {
        return from(this.recipeRepository.find()).pipe(
            map((recipes: Recipe[]) => {
                return recipes;
            })
        )
    }

    findOne(id: number): Observable<Recipe> {
        return from(this.recipeRepository.findOneBy({id})).pipe(
            map((recipe: Recipe) => {
                console.log(recipe.ingredients);
                return recipe;
            })
        )
    }

    updateOne(id: number, recipe: Recipe): Observable<Recipe> {
        return from(this.recipeRepository.update(id, recipe)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    deleteOne(id: number): Observable<DeleteResult> {
        return from(this.recipeRepository.delete(id));
    }

    findByName(name: string): Observable<Recipe> {
        return from(this.recipeRepository.findOneBy({name}))
    }

    addIngredients(name: string, ingredients: Ingredient[]): Observable<Recipe> {
        return from(this.recipeRepository.findOneBy({name})).pipe(
            map((recipe: Recipe) => {
                ingredients.forEach((ingredient: Ingredient) => {
                    recipe.ingredients.push(ingredient);
                })
                this.recipeRepository.update(recipe.id, { ingredients: recipe.ingredients });
                return recipe;
            })
        )
    }
}
