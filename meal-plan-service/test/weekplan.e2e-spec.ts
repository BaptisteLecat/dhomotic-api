import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import request from 'supertest';
import {AppModule} from '../src/app.module';
import {TestDataEntity} from './test-data.entity';
import axios from 'axios';


function authenticateUser(email: string, password: string) {
    return axios.post('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=key', { "email": email, "password": password, "returnSecureToken": true }).then((response) => response.data.idToken);
}

describe('Weekplan Module (e2e)', () => {
    let app: INestApplication;
    let token: string;
    let testData: TestDataEntity;

    beforeAll(async () => {
        testData = new TestDataEntity();
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .compile();

        token = await authenticateUser(testData.user[0].email, testData.user[0].password);

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/houses/:houseId/weekplans (POST)', () => {
        return request(app.getHttpServer())
            .post(`/houses/${testData.houseId}/weekplans`)
            .set("api-key", "api_key")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .send({
                startDate: new Date("2025-02-24").toISOString(),
                endDate: new Date("2025-03-02").toISOString()
            })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.menu).toHaveLength(21);
            }).then((res) => {
                testData.weekplanId = res.body.id;
                testData.menuId = res.body.menu[0].id;
            });
    });

    it('/houses/:houseId/weekplans (GET)', () => {
        return request(app.getHttpServer())
            .get(`/houses/${testData.houseId}/weekplans`)
            .set("api-key", "api_key")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .expect((res) => {
                expect(res.body).toBeInstanceOf(Array);
                expect(res.body.length).toBeGreaterThan(0);
            });
    });

    it('/houses/:houseId/weekplans/:id (GET)', () => {
        return request(app.getHttpServer())
            .get(`/houses/${testData.houseId}/weekplans/${testData.weekplanId}`)
            .set("api-key", "api_key")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('id', testData.weekplanId);
            });
    });

    it('/houses/:houseId/weekplans/:id/cart (PUT)', () => {
        return request(app.getHttpServer())
            .put(`/houses/${testData.houseId}/weekplans/${testData.weekplanId}/cart`)
            .set("api-key", "api_key")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .send({
                userId: testData.user[0].uid,
                productItemId: testData.productItems[0].id,
                quantity: 1
            })
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('id', testData.productItems[0].id);
                expect(res.body).toHaveProperty('quantity', 1);
            });
    });

    it('/houses/:houseId/weekplans/:id/cart/:cartProductId (DELETE)', () => {
        return request(app.getHttpServer())
            .delete(`/houses/${testData.houseId}/weekplans/${testData.weekplanId}/cart/${testData.productItems[0].id}`)
            .set("api-key", "api_key")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .expect(200)
            .expect((res) => {
                expect(res.body).toEqual({});
            });
    });

    it('/houses/:houseId/weekplans/:id/menu/:menuId/meals (POST)', () => {
        return request(app.getHttpServer())
            .post(`/houses/${testData.houseId}/weekplans/${testData.weekplanId}/menu/${testData.menuId}/meals`)
            .set("api-key", "api_key")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .send({
                userId: testData.user[0].uid,
                mealId: testData.mealId
            })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id', testData.mealId);
            });
    });
});
