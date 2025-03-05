import {ApiProperty} from "@nestjs/swagger";
import {IsISO8601, IsNotEmpty, IsString} from "class-validator";

export class CreateWeekplanDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsISO8601()
    startDate: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsISO8601()
    endDate: string;
}