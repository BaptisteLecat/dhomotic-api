import { ConsoleLogger } from '@nestjs/common';

export class CustomLogging extends ConsoleLogger {
    log(message: any, context?: string): void;
    log(message: any, ...optionalParams: any[]): void;
    log(message: unknown, context?: unknown, ...rest: unknown[]): void {
        super.log(message, context, ...rest);
    }
}