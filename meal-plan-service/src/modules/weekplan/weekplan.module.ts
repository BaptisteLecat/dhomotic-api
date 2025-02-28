import {Module} from '@nestjs/common';
import {WeekPlanController} from './controllers/weekplan.controller';

@Module({
    controllers: [WeekPlanController],
    providers: [],
})
export class WeekplanModule {
}