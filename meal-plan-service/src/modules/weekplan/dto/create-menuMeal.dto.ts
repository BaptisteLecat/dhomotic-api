import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";

export class CreateMenuMealDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    mealId: string;
}