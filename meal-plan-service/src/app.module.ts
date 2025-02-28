import { Module } from '@nestjs/common';
import { GenerationModule } from './modules/generation/generation.module';
import { PromptGeneratorService } from './modules/generation/services/prompt_generator.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseProvider } from './providers/firebase.provider';
import { UsersModule } from './modules/users/users.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { FirebaseAuthService } from './services/firebase.auth.service';
import { LoggingModule } from './modules/logging/logging.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LocationsModule } from './modules/locations/locations.module';
import { StylesModule } from './modules/styles/styles.module';



@Module({
imports: [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  }),
  AuthModule,
  GenerationModule,
    UsersModule,
    AuthModule,
    LoggingModule,
    LocationsModule,
    StylesModule,
  ],
  controllers: [],
  providers: [PromptGeneratorService, FirebaseProvider, AuthService, FirebaseAuthService],
})
export class AppModule {}
