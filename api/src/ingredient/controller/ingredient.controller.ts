import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, Request, UseInterceptors, Res } from '@nestjs/common';
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { join } from 'path';
import { IngredientService } from '../service/ingredient.service';
import { map, Observable, of } from 'rxjs';
import { Ingredient } from '../model/ingredient.interface';
import { DeleteResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';

export const storage = {
    storage: diskStorage({
        destination: './upload/IngredientImages',
        filename: (req, file, cb) => {
            const filename: string = uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
        }
    })
};

@Controller('ingredients')
export class IngredientController {
    constructor(
        private readonly ingredientService: IngredientService
    ) {}

    @Post()
    create(
        @Body() createIngredientDto: CreateIngredientDto
    ): Observable<Ingredient> {
        return this.ingredientService.create(createIngredientDto).pipe(
            map((ingredient: Ingredient) => {
                return ingredient;
            })
        );
    }

    @Get()
    findAll(): Observable<Ingredient[]> {
        return this.ingredientService.findAll().pipe(
            map((ingredients: Ingredient[]) => {
                return ingredients;
            })
        );
    }

    @Get(':id')
    findOne(
        @Param('id') id: number
    ): Observable<Ingredient> {
        return this.ingredientService.findOne(id).pipe(
            map((ingredient: Ingredient) => {
                return ingredient;
            })
        )
    }

    @Put(':id')
    updateOne(
        @Param('id') id: number,
        @Body() updateIngredientDto: UpdateIngredientDto
    ): Observable<Ingredient> {
        return this.ingredientService.updateOne(id, updateIngredientDto);
    }

    @Delete(':id')
    deleteOne(
        @Param('id') id: number
    ): Observable<DeleteResult> {
        return this.ingredientService.deleteOne(id);
    }

    @Put('upload/:ingredientName')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadIngredientImage(
        @UploadedFile() file,
        @Param('ingredientName') ingredientName: string
    ): Observable<Ingredient> {
        return this.ingredientService.findByName(ingredientName).pipe(
            map((ingredient: Ingredient) => {
                this.ingredientService.updateOne(ingredient.id, { ingredient_image: file.filename });
                return { ingredient_image: file.filename };
            })
        );
        
    }

    @Get('image-ingredient/:imageName')
    findIngredientImage(
        @Param('imageName') imageName: string,
        @Res() response
    ): Observable<Ingredient> {
        return of(response.sendFile(join(process.cwd(), 'upload/ingredientImages/' + imageName))).pipe(
            map(() => {
                return { ingredient_image: imageName };
            })
        );
    }
}
