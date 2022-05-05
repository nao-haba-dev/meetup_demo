import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { tearDownDatabase, useRefreshDatabase } from 'typeorm-seeding';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from '../src/cats/entities/cat.entity';
import { AppModule } from '../src/app.module';
import { CatsController } from '../src/cats/cats.controller';
import { CreateCatDto } from '../src/cats/dto/create-cat.dto';
import { CatsService } from '../src/cats/cats.service';
import * as randomstring from 'randomstring';

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

  async function saveCat(body: CreateCatDto): Promise<request.Response> {
    return request(app.getHttpServer())
      .post('/cats')
      .set('Accept', 'application/json')
      .send(body);
  }

  async function getById(id: number): Promise<request.Response> {
    return request(app.getHttpServer()).get(`/cats/${id}`);
  }

  it('/ create(OK)(POST)', async () => {
    const dto: CreateCatDto = { name: 'テスト' };
    const res = await saveCat(dto);
    expect(res.body.name).toEqual(dto.name);
    expect(res.status).toEqual(201);
  });

  it('/ create(NG)-名前未入力(POST)', async () => {
    const dto: CreateCatDto = { name: null };
    const res = await saveCat(dto);
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual([
      '名前は255文字以内で入力してください',
      '名前は必須項目です',
    ]);
  });

  it('/ create(NG)-名前255文字以上(POST)', async () => {
    const dto: CreateCatDto = { name: randomstring.generate({ length: 256 }) };
    const res = await saveCat(dto);
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual(['名前は255文字以内で入力してください']);
  });

  it('/ findAll(OK)(GET)', async () => {
    const dto: CreateCatDto = { name: randomstring.generate({ length: 10 }) };
    await saveCat(dto);
    const res = await request(app.getHttpServer()).get('/cats');
    expect(res.status).toEqual(200);
    const { name } = res.body[0];
    expect(name).toEqual(dto.name);
  });

  it('/ findOne(OK)(GET)', async () => {
    const dto: CreateCatDto = { name: randomstring.generate({ length: 10 }) };
    const cat = await saveCat(dto);
    const res = await getById(cat.body.id);
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual(dto.name);
  });

  it('/ findOne(NG)-ID該当なし(GET)', async () => {
    const res = await getById(9999);
    expect(res.status).toEqual(404);
  });

  it('/ update(OK)(PATCH)', async () => {
    const body: CreateCatDto = {
      name: randomstring.generate({ length: 10 }),
    };

    const cat = await request(app.getHttpServer())
      .post('/cats')
      .set('Accept', 'application/json')
      .send(body);

    await request(app.getHttpServer())
      .patch(`/cats/${cat.body.id}`)
      .set('Accept', 'application/json')
      .send({ name: '更新' });

    const data = await request(app.getHttpServer()).get(`/cats/${cat.body.id}`);
    expect(data.status).toEqual(200);
    expect(data.body.name).toEqual('更新');
  });

  it('/ remove(OK)(DELETE)', async () => {
    const body: CreateCatDto = {
      name: randomstring.generate({ length: 10 }),
    };

    const cat = await request(app.getHttpServer())
      .post('/cats')
      .set('Accept', 'application/json')
      .send(body);

    const res = await request(app.getHttpServer()).delete(
      `/cats/${cat.body.id}`,
    );

    expect(res.status).toEqual(200);
    const data = await getById(cat.body.id);
    expect(data.status).toEqual(404);
  });
});
