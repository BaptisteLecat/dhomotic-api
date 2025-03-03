import {Module} from '@nestjs/common';
import {UserService} from "./services/user.service";
import {FirebaseProvider} from "../../providers/firebase.provider";
import {UserConverter} from "./converters/user.converter";

@Module({
    providers: [FirebaseProvider, UserService, UserConverter],
    exports: [UserService, UserConverter]
})
export class UserModule {
}