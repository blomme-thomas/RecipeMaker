import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Measure } from "./ingredient.interface";

@Entity()
export class IngredientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'enum', enum: Measure, default: Measure.AMOUNT })
    measure: Measure;

    @Column({ nullable: true })
    image: string;
}