import {Module} from '@nestjs/common';
import {ProductItemService} from "./services/productItem.service";
import {FirebaseProvider} from "../../providers/firebase.provider";
import {ProductItemConverter} from "./converters/productItem.converter";

@Module({
    providers: [FirebaseProvider, ProductItemService, ProductItemConverter],
    exports: [ProductItemService, ProductItemConverter]
})
export class ProductItemModule {
}