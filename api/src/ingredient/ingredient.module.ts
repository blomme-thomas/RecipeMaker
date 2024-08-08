import { Module } from '@nestjs/common';
import { IngredientService } from './service/ingredient.service';
import { IngredientController } from './controller/ingredient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientEntity } from './model/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientEntity])],
  providers: [IngredientService],
  controllers: [IngredientController]
})
export class IngredientModule {}
