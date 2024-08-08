export enum Measure {
    AMOUNT = "amaount",
    WEIGHT = "weight",
    CAPACITY = "capacity"
}

export interface Ingredient {
    id?: number;
    name?: string;
    measure?: Measure;
    image?: string;
}