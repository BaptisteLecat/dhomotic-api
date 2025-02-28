import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from '../src/modules/users/entities/user.entity';
import axios from 'axios';

function authenticateUser() {
  return axios.post('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=key', { "email": "alice@gmail.com", "password": "alicealice", "returnSecureToken": true }).then((response) => response.data.idToken);
}

describe('API (e2e)', function () {
  let app: INestApplication;
  let user: User;
  let token: string;
  let expiredToken: string;

  beforeAll(async () => {
    user = new User(
      'Ixt0stWixWMX1dLHKLpw1AixiAWZ',
      'Alice',
      'Alice',
      'alice@gmail.com',
      [],
      [],
    );

    token = await authenticateUser();
    console.log(token.length);
    expiredToken = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJuYW1lIjoiYWxpY2UiLCJwaWN0dXJlIjoiIiwiZW1haWwiOiJhbGljZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImF1dGhfdGltZSI6MTcxMzE3NzAyOCwidXNlcl9pZCI6IjNLOWZZemdKR2xJeDRPdVFnZm1VMVlFRG4ybGIiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFsaWNlQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn0sImlhdCI6MTcxMzE3NzAyOCwiZXhwIjoxNzEzMTgwNjI4LCJhdWQiOiJ3ZWF0aGVyYXBwLWpvdXJuZXkiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vd2VhdGhlcmFwcC1qb3VybmV5Iiwic3ViIjoiM0s5Zll6Z0pHbEl4NE91UWdmbVUxWUVEbjJsYiJ9.";
  });

  afterEach(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  describe('User Module', function () {
    describe('/users/:id (GET) :', function () {
      it('should return an user', async function () {
        return await request(app.getHttpServer())
          .get(`/users/${user.id}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .expect((res) => {
            // Vérification de la structure et des types de l'objet utilisateur
            expect(res.body).toEqual(expect.objectContaining({
              email: expect.any(String),
              frequencies: expect.any(Array),
              id: expect.any(String),
              styles: expect.any(Array),
            }));
          });
      });

      it('should return an error if user not found', async function () {
        return await request(app.getHttpServer())
          .get('/users/unknown')
          .expect(404)
          .expect('Content-Type', /json/)
          .expect((res) => {
            // Vérification de la structure et des types de l'objet erreur
            expect(res.body).toEqual(expect.objectContaining({
              statusCode: expect.any(Number),
              message: expect.any(String),
            }));
          });
      });
    });
    describe('/users (GET)', function () {
      it('should return an array of users', async function () {
        return await request(app.getHttpServer())
          .get('/users')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect((res) => {
            // Vérification de la structure et des types de l'objet utilisateur
            expect(res.body).toEqual(expect.arrayContaining([
              expect.objectContaining({
                email: expect.any(String),
                frequencies: expect.any(Array),
                id: expect.any(String),
                styles: expect.any(Array),
              }),
            ]));
          });
      });
    });
  });

  describe('Generation Module', function () {
    describe('/generations (POST)', function () {
      it('should return an array of generations', async function () {
        const res = await request(app.getHttpServer())
          .post('/locations/0eWSjfdXTUT91QTWYR5g/generations')
          .set("api-key", "api_key")
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "application/json")
          .send({ "time": "Alice", "weather": "Alice" })
          .expect((res) => {
            // Vérification de la structure et des types de l'objet génération
            expect(res.body).toEqual(expect.objectContaining({
              id: expect.any(String),
              generatedImage: null,
              progress: expect.any(Number),
              prompt: expect.any(String)
            }));
          });
      }, 20000);

      it('should return an error if location not found', async function () {
        return await request(app.getHttpServer())
          .post('/locations/unknown/generations')
          .set("api-key", "api_key")
          .set("Authorization", `Bearer ${token}`)
          .set("Content-Type", "application/json")
          .send({ "time": "Alice", "weather": "Alice" })
          .expect(404)
          .expect('Content-Type', /json/)
          .expect((res) => {
            // Vérification de la structure et des types de l'objet erreur
            expect(res.body).toEqual(expect.objectContaining({
              statusCode: expect.any(Number),
              message: expect.any(String),
            }));
          });
      });

      describe('Authentication', function () {
        describe('Authentication Token', function () {
          it('should return an error if user not authenticated', async function () {
            return await request(app.getHttpServer())
              .post('/locations/0eWSjfdXTUT91QTWYR5g/generations')
              .set("api-key", "api_key")
              .expect(400)
              .expect('Content-Type', /json/)
              .expect((res) => {
                // Vérification de la structure et des types de l'objet erreur
                expect(res.body).toEqual(expect.objectContaining({
                  statusCode: expect.any(Number),
                  message: expect.any(String),
                }));
              });
          });

          it('should return an error if user token is expired', async function () {
            return await request(app.getHttpServer())
              .post('/locations/0eWSjfdXTUT91QTWYR5g/generations')
              .set("api-key", "api_key")
              .set("Authorization", `Bearer ${expiredToken}`)
              .set("Content-Type", "application/json")
              .send({ "time": "Alice", "weather": "Alice" })
              .expect(401)
              .expect('Content-Type', /json/)
              .expect((res) => {
                // Vérification de la structure et des types de l'objet erreur
                expect(res.body).toEqual(expect.objectContaining({
                  statusCode: expect.any(Number),
                  message: expect.any(String),
                }));
              });
          });

          it('should return an error if user token is invalid', async function () {
            return await request(app.getHttpServer())
              .post('/locations/0eWSjfdXTUT91QTWYR5g/generations')
              .set("api-key", "api_key")
              .set("Authorization", `Bearer invalid_token`)
              .set("Content-Type", "application/json")
              .send({ "time": "Alice", "weather": "Alice" })
              .expect(400)
              .expect('Content-Type', /json/)
              .expect((res) => {
                // Vérification de la structure et des types de l'objet erreur
                expect(res.body).toEqual(expect.objectContaining({
                  statusCode: expect.any(Number),
                  message: expect.any(String),
                }));
              });
          });
        });
        describe('Authentication API Key', function () {
          it('should return an error if user not authenticated', async function () {
            return await request(app.getHttpServer())
              .post('/locations/0eWSjfdXTUT91QTWYR5g/generations')
              .set("Authorization", `Bearer ${token}`)
              .set("Content-Type", "application/json")
              .expect(400)
              .expect('Content-Type', /json/)
              .expect((res) => {
                // Vérification de la structure et des types de l'objet erreur
                expect(res.body).toEqual(expect.objectContaining({
                  statusCode: expect.any(Number),
                  message: expect.any(String),
                }));
              });
          });

          it('should return an error if user API Key is invalid', async function () {
            return await request(app.getHttpServer())
              .post('/locations/0eWSjfdXTUT91QTWYR5g/generations')
              .set("api-key", "invalid_api_key")
              .set("Authorization", `Bearer ${token}`)
              .set("Content-Type", "application/json")
              .send({ "time": "Alice", "weather": "Alice" })
              .expect(401)
              .expect('Content-Type', /json/)
              .expect((res) => {
                // Vérification de la structure et des types de l'objet erreur
                expect(res.body).toEqual(expect.objectContaining({
                  statusCode: expect.any(Number),
                  message: expect.any(String),
                }));
              });
          });
        });
      });
    });
  });
});
