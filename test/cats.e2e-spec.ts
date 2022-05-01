import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { tearDownDatabase, useRefreshDatabase } from 'typeorm-seeding';
import { CatsModule } from '../src/cats/cats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from '../src/cats/entities/cat.entity';
import { AppModule } from '../src/app.module';
import { CatsController } from '../src/cats/cats.controller';
import { CreateCatDto } from '../src/cats/dto/create-cat.dto';
import { CatsService } from '../src/cats/cats.service';

describe('CatsController (e2e)', () => {
  let app: INestApplication;

  // テスト実行時に毎回実行します
  beforeEach(async () => {
    // DBに接続＆内部のデータをリフレッシュ
    await useRefreshDatabase();
  });

  // テスト前に1回だけ実行します
  beforeAll(async () => {
    // モジュールでDIしている対象を定義します
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Cat]), AppModule],
      controllers: [CatsController],
      providers: [CatsService],
    }).compile();

    // モジュールからインスタンスを作成します
    app = moduleFixture.createNestApplication();

    // Auto-validation
    app.useGlobalPipes(new ValidationPipe());

    // モジュールの初期化
    await app.init();
  });

  // テスト後に1回だけ実行します
  afterAll(async () => {
    // テスト終了
    await app.close();

    // DBとの接続を終了する
    await tearDownDatabase();
  });

  it('/ (POST)', async () => {
    const body: CreateCatDto = {
      name: 'テスト',
    };

    const res = await request(app.getHttpServer())
      .post('/cats')
      .set('Accept', 'application/json')
      .send(body);

    expect(res.status).toEqual(201);
  });
});
