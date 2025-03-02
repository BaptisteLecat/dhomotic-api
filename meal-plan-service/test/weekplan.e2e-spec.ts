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

        token = await authenticateUser(testData.firstUserEmail, testData.firstUserPassword);

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
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
});
