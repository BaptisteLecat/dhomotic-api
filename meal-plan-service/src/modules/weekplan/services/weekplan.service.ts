import {Inject, Injectable} from '@nestjs/common';
import {WeekplanConverter} from '../converters/weekplan.converter';
import {FirebaseProvider} from '../../../providers/firebase.provider';
import {Weekplan} from '../entities/weekplan.entity';
import {CreateWeekplanDto} from "../dto/create-weekplan.dto";
import {CartProduct} from "../entities/cartProduct.entity";
import {AddCartProductDto} from "../dto/add-cartProduct.dto";
import {UserService} from "../../user/services/user.service";
import {ProductItemService} from "../../productItem/services/productItem.service";
import {CartUser} from "../entities/cartUser.entity";
import {CartProductItem} from "../entities/cartProductItem.entity";

@Injectable()
export class WeekplanService {
    static readonly collection: string = 'weekplans';

    constructor(
        @Inject(FirebaseProvider)
        private readonly firestoreProvider: FirebaseProvider,
        private weekPlanConverter: WeekplanConverter,
        @Inject(UserService)
        private readonly userService: UserService,
        @Inject(ProductItemService)
        private readonly productItemService: ProductItemService,
    ) {
    }

    async findAll(houseId: string): Promise<Weekplan[]> {
        const weekplans = await this.firestoreProvider
            .getFirestore()
            .collection('houses')
            .doc(houseId)
            .collection(WeekplanService.collection)
            .withConverter(this.weekPlanConverter)
            .get();
        return weekplans.docs.map((weekPlan) =>
            this.weekPlanConverter.fromFirestore(weekPlan),
        );
    }

    async findOne(id: string, houseId: string): Promise<Weekplan | undefined> {
        const weekPlan = await this.firestoreProvider
            .getFirestore()
            .collection('houses')
            .doc(houseId)
            .collection(WeekplanService.collection)
            .doc(id)
            .withConverter(this.weekPlanConverter)
            .get();
        if (!weekPlan.exists) {
            return undefined;
        }
        return this.weekPlanConverter.fromFirestoreDocumentSnapshot(weekPlan);
    }

    async create(createWeekplanDto: CreateWeekplanDto, houseId: string): Promise<Weekplan> {
        const id = this.firestoreProvider.getFirestore().collection('houses').doc(houseId).collection(WeekplanService.collection).doc().id;
        const weekPlan = new Weekplan(id);
        const weekPlanRef = await this.firestoreProvider
            .getFirestore()
            .collection('houses')
            .doc(houseId)
            .collection(WeekplanService.collection)
            .doc(id)
            .withConverter(this.weekPlanConverter)
            .set(weekPlan);
        return weekPlan;
    }

    async addCartProduct(id: string, houseId: string, addCartProductDto: AddCartProductDto): Promise<CartProduct> {

        //Step 1: Get weekplan
        let weekPlan = await this.findOne(id, houseId);
        if (!weekPlan) {
            //Step 1.1: Create weekplan if not exist
            weekPlan = await this.create(new CreateWeekplanDto(), houseId);
        }

        //Step 2: Get the data of the user who add the CartProduct, from the id in the addCartProductDto
        //Step 2.1: Get the user from the id
        const user = await this.userService.findOne(addCartProductDto.userId);
        if (!user) {
            throw new Error(`User with id ${addCartProductDto.userId} not found`);
        }

        //Step 3: Get the productItem from the id in the addCartProductDto
        const productItem = await this.productItemService.findOne(addCartProductDto.productItemId);
        if (!productItem) {
            throw new Error(`ProductItem with id ${addCartProductDto.productItemId} not found`);
        }

        //Step 4: Create the CartProduct Entity
        const cartProduct = new CartProduct(
            productItem.id,
            addCartProductDto.quantity,
            new CartUser(
                user.uid,
                user.displayName,
                user.email,
                user.photoURL,
            ),
            new CartProductItem(
                productItem.id,
                productItem.name,
                productItem.price,
            ),
        );

        //Step 5: Replace the CartProduct if already exist
        const index = weekPlan.cart.findIndex((cartProduct) => cartProduct.id === productItem.id);
        if (index !== -1) {
            //Step 5.1: Replace the CartProduct
            weekPlan.cart[index] = cartProduct;
        } else {
            //Step 5.1(bis): Add the CartProduct to the Weekplan
            weekPlan.cart.push(cartProduct);
        }

        //Step 6: Save the Weekplan
        await this.firestoreProvider
            .getFirestore()
            .collection('houses')
            .doc(houseId)
            .collection(WeekplanService.collection)
            .doc(id)
            .withConverter(this.weekPlanConverter)
            .set(weekPlan);
        return cartProduct;
    }

    async removeCartProduct(id: string, houseId: string, cartProductId: string): Promise<void> {
        //Step 1: Get weekplan
        let weekPlan = await this.findOne(id, houseId);
        if (!weekPlan) {
            throw new Error(`Weekplan with id ${id} not found`);
        }

        //Step 2: Delete the CartProduct
        weekPlan.cart = weekPlan.cart.filter((cartProduct) => cartProduct.id !== cartProductId);

        //Step 3: Save the Weekplan
        await this.firestoreProvider
            .getFirestore()
            .collection('houses')
            .doc(houseId)
            .collection(WeekplanService.collection)
            .doc(id)
            .withConverter(this.weekPlanConverter)
            .set(weekPlan);
    }
}
