import {Controller, Get, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {ApiKeyAuthGuard} from "../auth/guard/api-key-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@UseGuards(ApiKeyAuthGuard, JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiBearerAuth('ApiKey')
@Controller('example')
export class ExampleController {
  @Get()
  getExample(): string {
    return 'This is an example endpoint';
  }
}
