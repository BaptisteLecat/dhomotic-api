import { Module } from '@nestjs/common';
import { CustomLogging } from './custom-logging';

@Module({
    providers: [CustomLogging],
    exports: [CustomLogging],
})
export class LoggingModule {}
