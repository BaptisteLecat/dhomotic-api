export class TestDataEntity {
    houseId: string;
    weekplanId: string;
    menuId: string;
    mealId: string;
    user: {
        uid: string;
        email: string;
        password: string;
    }[];
    productItems: {
        id: string;
        name: string;
    }[];

    constructor() {
        this.houseId = '3K9fYzgJGlIx4OuQgfmU1YEDn2lb';
        this.mealId = 'oBLRqG8ygkxx7rHAbIPp';
        this.user = [
            {
                uid: '3K9fYzgJGlIx4OuQgfmU1YEDn2lb',
                email: 'alice@gmail.com',
                password: 'alicealice',
            },
        ];
        this.productItems = [
            {
                id: 'fSdtdUDVf4tlg6JffP53',
                name: 'Chocolat',
            },
            {
                id: 'Ju9N0RLqiNz6OicnZZu1',
                name: 'Poire',
            },
        ];
    }
}