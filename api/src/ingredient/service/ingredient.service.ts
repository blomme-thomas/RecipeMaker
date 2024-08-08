import { Injectable } from '@nestjs/common';
import { IngredientEntity } from '../model/ingredient.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { Ingredient } from '../model/ingredient.interface';

@Injectable()
export class IngredientService {
    constructor(
        @InjectRepository(IngredientEntity)
        private readonly ingredientRepository: Repository<IngredientEntity>
    ) {}

    create(ingredient: Ingredient): Observable<Ingredient> {
        return from(this.ingredientRepository.save(ingredient)).pipe(
            map((ingredient: Ingredient) => {
                return ingredient;
            })
        );
    }

    findAll(): Observable<Ingredient[]> {
        return from(this.ingredientRepository.find()).pipe(
            map((ingredients: Ingredient[]) => {
                return ingredients;
            })
        )
    }

    findOne(id: number): Observable<Ingredient> {
        return from(this.ingredientRepository.findOneBy({id})).pipe(
            map((ingredient: Ingredient) => {
                return ingredient;
            })
        )
    }

    updateOne(id: number, ingredient: Ingredient): Observable<Ingredient> {
        return from(this.ingredientRepository.update(id, ingredient)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    deleteOne(id: number): Observable<DeleteResult> {
        return from(this.ingredientRepository.delete(id));
    }

    findByName(name: string): Observable<Ingredient> {
        return from(this.ingredientRepository.findOneBy({name}));
    }
}
