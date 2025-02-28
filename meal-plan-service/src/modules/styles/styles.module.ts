import { Module } from '@nestjs/common';
import { FirebaseProvider } from '../../providers/firebase.provider';
import { StyleConverter } from './converters/style.converter';
import { StylesService } from './styles.service';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthService } from '../../services/firebase.auth.service';
import { UsersService } from '../users/users.service';
import { UserConverter } from '../users/converters/user.converter';

@Module({
  providers: [StyleConverter, FirebaseProvider, StylesService, AuthService, FirebaseAuthService, UsersService, UserConverter],
})
export class StylesModule {}

