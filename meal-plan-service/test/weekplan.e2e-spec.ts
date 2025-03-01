import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { FirebaseProvider } from '../src/providers/firebase.provider';

describe('Weekplan Module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FirebaseProvider)
      .useValue({
        getFirestore: () => {
          // Return the Firestore instance connected to the emulator
          return new FirebaseProvider().getFirestore();
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/houses/:houseId/weekplans (GET)', () => {
    return request(app.getHttpServer())
      .get('/houses/houseId/weekplans')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('/houses/:houseId/weekplans/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/houses/houseId/weekplans/weekplanId')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', 'weekplanId');
      });
  });
});
