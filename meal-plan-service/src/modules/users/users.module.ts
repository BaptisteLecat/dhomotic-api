import { Module } from '@nestjs/common';
import { FirebaseProvider } from '../../providers/firebase.provider';
import { UserConverter } from './converters/user.converter';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthService } from '../../services/firebase.auth.service';
import { StylesService } from '../styles/styles.service';
import { StyleConverter } from '../styles/converters/style.converter';

@Module({
  providers: [UserConverter, FirebaseProvider, UsersService, AuthService, FirebaseAuthService, StylesService, StyleConverter],
  controllers: [UsersController],
})
export class UsersModule {}

