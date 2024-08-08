import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RecipeService } from '../service/recipe.service';
import { Recipe } from '../model/recipe.interface';
import { map, Observable, of } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { Ingredient } from 'src/ingredient/model/ingredient.interface';
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';

export const storage = {
    storage: diskStorage({
        destination: './upload/recipeImages',
        filename: (req, file, cb) => {
            const filename: string = uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
        }
    })
};

@Controller('recipes')
export class RecipeController {
    constructor(
        private readonly recipeService: RecipeService
    ) {}

    @Post()
    create(
        @Body() createRecipeDto: CreateRecipeDto
    ): Observable<Recipe> {
        return this.recipeService.create(createRecipeDto).pipe(
            map((recipe: Recipe) => {
                return recipe;
            })
        )
    }

    @Get()
    findAll(): Observable<Recipe[]> {
        return this.recipeService.findAll().pipe(
            map((recipes: Recipe[]) => {
                return recipes;
            })
        )
    }

    @Get(':id')
    findOne(
        @Param('id') id: number
    ): Observable<Recipe> {
        return this.recipeService.findOne(id).pipe(
            map((recipe: Recipe) => {
                return recipe;
            })
        )
    }

    @Put(':id')
    updateOne(
        @Param('id') id: number,
        @Body() updateRecipeDto: UpdateRecipeDto
    ): Observable<Recipe> {
        return this.recipeService.updateOne(id, updateRecipeDto).pipe(
            map((recipe: Recipe) => {
                return recipe;
            })
        )
    }

    @Delete(':id')
    deleteOne(
        @Param('id') id: number
    ): Observable<DeleteResult> {
        return this.recipeService.deleteOne(id);
    }

    @Get(':name')
    findByName(
        @Param('name') name: string
    ): Observable<Recipe> {
        return this.recipeService.findByName(name).pipe(
            map((recipe: Recipe) => {
                return recipe;
            })
        )
    }

    @Put('add-ingredients/:name')
    addIngredients(
        @Param('name') name: string,
        @Body() ingredients: Ingredient[]
    ): Observable<Recipe> {
        return this.recipeService.addIngredients(name, ingredients).pipe(
            map((recipe: Recipe) => {
                return recipe;
            })
        )
    }

    @Put('upload/:recipeName')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadRecipeImage(
        @UploadedFile() file,
        @Param('recipeName') recipeName: string
    ): Observable<Recipe> {
        return this.recipeService.findByName(recipeName).pipe(
            map((recipe: Recipe) => {
                this.recipeService.updateOne(recipe.id, { recipe_image: file.filename });
                return { recipe_image: file.filename };
            })
        );
        
    }

    @Get('image-recipe/:imageName')
    findIngredientImage(
        @Param('imageName') imageName: string,
        @Res() response
    ): Observable<Recipe> {
        return of(response.sendFile(join(process.cwd(), 'upload/recipeImages/' + imageName))).pipe(
            map(() => {
                return { recipe_image: imageName };
            })
        );
    }
}
