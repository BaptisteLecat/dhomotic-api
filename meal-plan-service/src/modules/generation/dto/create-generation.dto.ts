import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreateGenerationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    time: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    weather: string;
}
