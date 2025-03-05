import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";
import {Timestamp} from "@google-cloud/firestore";

export class CreateWeekplanDto {
    @ApiProperty()
    @IsNotEmpty()
    startDate: Timestamp;

    @ApiProperty()
    @IsNotEmpty()
    endDate: Timestamp;
}