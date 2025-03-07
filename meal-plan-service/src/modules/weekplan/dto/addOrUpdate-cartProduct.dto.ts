import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";

export class AddOrUpdateCartProductDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    productItemId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsISO8601()
    checkedAt?: string;
}