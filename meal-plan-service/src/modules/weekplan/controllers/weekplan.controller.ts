import {Body, Controller, Get, Inject, Param, Post, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../auth/guard/jwt-auth.guard";
import {ApiKeyAuthGuard} from "../../auth/guard/api-key-auth.guard";
import {ApiBearerAuth, ApiBody, ApiParam, ApiTags} from "@nestjs/swagger";
import {WeekplanService} from "../services/weekplan.service";
import {CreateWeekplanDto} from "../dto/create-weekplan.dto";

@UseGuards(ApiKeyAuthGuard, JwtAuthGuard)
@ApiTags('WeekPlans')
@ApiBearerAuth('JWT-auth')
@ApiBearerAuth('ApiKey')
@Controller({
    version: '1',
    path: 'houses/:houseId/weekplans',
})
export class WeekPlanController {

    constructor(@Inject(WeekplanService) private readonly weekplanService: WeekplanService) {
    }

    @Get()
    @ApiParam({name: 'houseId', type: String})
    async getAllWeekPlan(
        @Param('houseId') houseId: string,
    ) {
        return this.weekplanService.findAll(houseId);
    }

    @Get(':id')
    @ApiParam({name: 'houseId', type: String})
    @ApiParam({name: 'id', type: String})
    async getWeekPlan(
        @Param('id') id: string,
        @Param('houseId') houseId: string,
    ) {
        return this.weekplanService.findOne(id, houseId);
    }

    @Post()
    @ApiParam({name: 'houseId', type: String})
    @ApiBody({ type: CreateWeekplanDto })
    async createWeekPlan(
        @Param('houseId') houseId: string,
        @Body() createWeekplanDto: CreateWeekplanDto,
    ) {
        return this.weekplanService.create(createWeekplanDto, houseId);
    }
}