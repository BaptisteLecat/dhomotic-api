import {Module} from '@nestjs/common';
import {UserService} from "./services/user.service";
import {FirebaseProvider} from "../../providers/firebase.provider";
import {UserConverter} from "./converters/user.converter";
import {NestedUserConverter} from "./converters/nestedUser.converter";

@Module({
    providers: [FirebaseProvider, UserService, UserConverter, NestedUserConverter],
    exports: [UserService, UserConverter, NestedUserConverter]
})
export class UserModule {
}