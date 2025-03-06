import {Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../../auth/guard/jwt-auth.guard";
import {ApiKeyAuthGuard} from "../../auth/guard/api-key-auth.guard";
import {ApiBearerAuth, ApiBody, ApiParam, ApiTags} from "@nestjs/swagger";
import {WeekplanService} from "../services/weekplan.service";
import {CreateWeekplanDto} from "../dto/create-weekplan.dto";
import {AddOrUpdateCartProductDto} from "../dto/addOrUpdate-cartProduct.dto";
import {CreateMenuMealDto} from "../dto/create-menuMeal.dto";

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
    @ApiBody({type: CreateWeekplanDto})
    async createWeekPlan(
        @Param('houseId') houseId: string,
        @Body() createWeekplanDto: CreateWeekplanDto,
    ) {
        return this.weekplanService.create(createWeekplanDto, houseId);
    }

    @Put(':id/cart')
    @ApiParam({name: 'houseId', type: String})
    @ApiParam({name: 'id', type: String})
    @ApiBody({type: AddOrUpdateCartProductDto})
    async addOrUpdateCartProduct(
        @Param('id') id: string,
        @Param('houseId') houseId: string,
        @Body() addOrUpdateCartProductDto: AddOrUpdateCartProductDto,
    ) {
        return this.weekplanService.addOrUpdateCartProduct(id, houseId, addOrUpdateCartProductDto);
    }

    @Delete(':id/cart/:cartProductId')
    @ApiParam({name: 'houseId', type: String})
    @ApiParam({name: 'id', type: String})
    @ApiParam({name: 'cartProductId', type: String})
    async removeCartProduct(
        @Param('id') id: string,
        @Param('houseId') houseId: string,
        @Param('cartProductId') cartProductId: string,
    ) {
        return this.weekplanService.removeCartProduct(id, houseId, cartProductId);
    }

    @Post(':id/menu/:menuId/menu-meals')
    @ApiParam({name: 'houseId', type: String})
    @ApiParam({name: 'id', type: String})
    @ApiParam({name: 'menuId', type: String})
    @ApiBody({type: CreateMenuMealDto})
    async createMenuMeal(@Param('id') id: string, @Param('menuId') menuId: string, @Param('houseId') houseId: string, @Body() createMenuMealDto: CreateMenuMealDto) {
        return this.weekplanService.createMenuMeal(menuId, id, houseId, createMenuMealDto);
    }

    @Delete(':id/menu/:menuId/menu-meals/:menuMealId')
    @ApiParam({name: 'houseId', type: String})
    @ApiParam({name: 'id', type: String})
    @ApiParam({name: 'menuId', type: String})
    @ApiParam({name: 'menuMealId', type: String})
    @ApiBody({type: CreateMenuMealDto})
    async removeMenuMeal(@Param('id') id: string, @Param('menuMealId') menuMealId: string, @Param('menuId') menuId: string, @Param('houseId') houseId: string, @Body() createMenuMealDto: CreateMenuMealDto) {
        return this.weekplanService.removeMenuMeal(menuMealId, menuId, id, houseId);
    }


}