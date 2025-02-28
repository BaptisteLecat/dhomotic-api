import {Controller, Get, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../auth/guard/jwt-auth.guard";
import {ApiKeyAuthGuard} from "../../auth/guard/api-key-auth.guard";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@UseGuards(ApiKeyAuthGuard, JwtAuthGuard)
@ApiTags('WeekPlans')
@ApiBearerAuth('JWT-auth')
@ApiBearerAuth('ApiKey')
@Controller({
    version: '1',
    path: 'houses/:houseId/weekplans',
})
export class WeekPlanController {
    @Get()
    async getWeekPlan() {
        return 'Week plan';
    }
}