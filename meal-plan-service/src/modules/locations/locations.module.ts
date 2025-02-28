import { Module } from '@nestjs/common';
import { FirebaseProvider } from '../../providers/firebase.provider';
import { LocationConverter } from './converters/location.converter';
import { LocationsService } from './locations.service';
import { AuthService } from '../auth/auth.service';
import { FirebaseAuthService } from '../../services/firebase.auth.service';
import { UsersService } from '../users/users.service';
import { UserConverter } from '../users/converters/user.converter';
import { StylesService } from '../styles/styles.service';
import { StyleConverter } from '../styles/converters/style.converter';

@Module({
  providers: [LocationConverter, FirebaseProvider, LocationsService, AuthService, FirebaseAuthService, UsersService, UserConverter, StylesService, StyleConverter],
})
export class LocationsModule {}

