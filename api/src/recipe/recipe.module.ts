import { Module } from '@nestjs/common';
import { RecipeService } from './service/recipe.service';
import { RecipeController } from './controller/recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './model/recipe.entity';
import { IngredientService } from 'src/ingredient/service/ingredient.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  providers: [RecipeService],
  controllers: [RecipeController]
})
export class RecipeModule {}
