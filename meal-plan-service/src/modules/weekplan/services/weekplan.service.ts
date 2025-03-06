import {Inject, Injectable} from '@nestjs/common';
import {WeekplanConverter} from '../converters/weekplan.converter';
import {FirebaseProvider} from '../../../providers/firebase.provider';
import {Weekplan} from '../entities/weekplan.entity';
import {CreateWeekplanDto} from "../dto/create-weekplan.dto";
import {CartProduct} from "../entities/cartProduct.entity";
import {AddOrUpdateCartProductDto} from "../dto/addOrUpdate-cartProduct.dto";
import {UserService} from "../../user/services/user.service";
import {ProductItemService} from "../../productItem/services/productItem.service";
import {CartProductItem} from "../entities/cartProductItem.entity";
import {NestedUser} from "../../user/entities/nestedUser.entity";
import {MenuMeal} from "../entities/menuMeal.entity";
import {MealService} from "../../meal/services/meal.service";
import {CreateMenuMealDto} from "../dto/create-menuMeal.dto";
import {Menu} from "../entities/menu.entity";

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
        @Inject(MealService)
        private readonly mealService: MealService,
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
        const weekPlan = new Weekplan(id, createWeekplanDto.startDate, createWeekplanDto.endDate);
        weekPlan.menu = await this.generateMenu(weekPlan);
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

    //Menus are generated at the creation of the weekplan
    //There are 3 meals per day, each day has 3 slices
    //Menus are generated for the number of days in the weekplan (between startDate and endDate)
    async generateMenu(weekplan: Weekplan): Promise<Menu[]> {
        let menus: Menu[] = [];
        const days = weekplan.endDateTimestamp.toMillis() - weekplan.startDateTimestamp.toMillis();
        const numberOfDays = days / (1000 * 60 * 60 * 24) + 1;
        for (let i = 0; i < numberOfDays; i++) {
            for (let j = 0; j < 3; j++) {
                const id = this.firestoreProvider.getFirestore().collection('houses').doc(weekplan.id).collection(WeekplanService.collection).doc().id;
                const menu = new Menu(id, i, j);
                menus.push(menu);

            }
        }
        return menus;
    }

    async addOrUpdateCartProduct(id: string, houseId: string, addOrUpdateCartProductDto: AddOrUpdateCartProductDto): Promise<CartProduct> {

        //Step 1: Get weekplan
        let weekPlan = await this.findOne(id, houseId);
        if (!weekPlan) {
            //Step 1.1: Create weekplan if not exist
            weekPlan = await this.create(new CreateWeekplanDto(), houseId);
        }

        //Step 2: Get the data of the user who add the CartProduct, from the id in the addOrUpdateCartProductDto
        //Step 2.1: Get the user from the id
        const user = await this.userService.findOne(addOrUpdateCartProductDto.userId);
        if (!user) {
            throw new Error(`User with id ${addOrUpdateCartProductDto.userId} not found`);
        }

        //Step 3: Get the productItem from the id in the addOrUpdateCartProductDto
        const productItem = await this.productItemService.findOne(addOrUpdateCartProductDto.productItemId);
        if (!productItem) {
            throw new Error(`ProductItem with id ${addOrUpdateCartProductDto.productItemId} not found`);
        }

        //Step 4: Create the CartProduct Entity
        const cartProduct = new CartProduct(
            productItem.id,
            addOrUpdateCartProductDto.quantity,
            new NestedUser(
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

    async createMenuMeal(menuId: string, weekplanId: string, houseId: string, createMenuMealDto: CreateMenuMealDto): Promise<MenuMeal> {

        //Step 1: Get weekplan
        let weekPlan = await this.findOne(weekplanId, houseId);
        if (!weekPlan) {
            throw new Error(`Weekplan with id ${weekplanId} not found`);
        }

        //Step 2: Get the data of the user who add the CartProduct, from the id in the addOrUpdateCartProductDto
        const user = await this.userService.findOne(createMenuMealDto.userId);
        if (!user) {
            throw new Error(`User with id ${createMenuMealDto.userId} not found`);
        }

        //Step 3: Check if the menu exist in the weekplan
        const menu = weekPlan.menu.find((menu) => menu.id === menuId);
        if (!menu) {
            throw new Error(`Menu with id ${menuId} not found in the weekplan with id ${weekplanId}`);
        }

        //Step 4: Check if the meal does not already exist in the menu
        const index = menu.menuMeals.findIndex((menuMeal) => menuMeal.meal.id === createMenuMealDto.mealId);
        if (index !== -1) {
            throw new Error(`Meal with id ${createMenuMealDto.mealId} already exist in the menu with id ${menuId}`);
        }

        //Step 5: Get the Meal from the id in the createMenuMealDto
        const meal = await this.mealService.findOne(createMenuMealDto.mealId);
        if (!meal) {
            throw new Error(`Meal with id ${createMenuMealDto.mealId} not found`);
        }

        //Step 6: Create the MenuMeal Entity

        //Step 6.1: Generate a unique id for the MenuMeal
        const menuMealId = this.firestoreProvider.getFirestore().collection('houses').doc(houseId).collection(WeekplanService.collection).doc().id;

        const menuMeal = new MenuMeal(
            menuMealId,
            new NestedUser(
                user.uid,
                user.displayName,
                user.email,
                user.photoURL,
            ),
            meal,
        );

        //Step 7: Add the MenuMeal to the Menu
        weekPlan.menu.find((menu) => menu.id === menuId).menuMeals.push(menuMeal);

        //Step 8: Save the Weekplan
        await this.firestoreProvider
            .getFirestore()
            .collection('houses')
            .doc(houseId)
            .collection(WeekplanService.collection)
            .doc(weekplanId)
            .withConverter(this.weekPlanConverter)
            .set(weekPlan);
        return menuMeal;
    }

    async removeMenuMeal(menuMealId: string, menuId: string, weekplanId: string, houseId: string): Promise<void> {
        //Step 1: Get weekplan
        let weekPlan = await this.findOne(weekplanId, houseId);
        if (!weekPlan) {
            throw new Error(`Weekplan with id ${weekplanId} not found`);
        }

        //Step 2: Check if the menu exist in the weekplan
        const menu = weekPlan.menu.find((menu) => menu.id === menuId);
        if (!menu) {
            throw new Error(`Menu with id ${menuId} not found in the weekplan with id ${weekplanId}`);
        }

        //Step 3: Delete the MenuMeal
        menu.menuMeals = menu.menuMeals.filter((menuMeal) => menuMeal.id !== menuMealId);

        //Step 4: Save the Weekplan
        await this.firestoreProvider
            .getFirestore()
            .collection('houses')
            .doc(houseId)
            .collection(WeekplanService.collection)
            .doc(weekplanId)
            .withConverter(this.weekPlanConverter)
            .set(weekPlan);
    }
}
