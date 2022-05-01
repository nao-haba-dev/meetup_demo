import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CatsService {
  constructor(@InjectRepository(Cat) private catRepository: Repository<Cat>) {}

  /**
   * @summary 登録機能
   * @param createCatDto
   */
  async create(createCatDto: CreateCatDto): Promise<Cat> {
    return await this.catRepository
      .save({ name: createCatDto.name })
      .catch((e) => {
        throw new InternalServerErrorException(e.message);
      });
  }

  /**
   * @summary 全件取得
   */
  async findAll(): Promise<Cat[]> {
    return await this.catRepository.find().catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }

  /**
   * @summary 該当ID取得
   * @param id
   */
  async findOne(id: number): Promise<Cat> {
    const cat = await this.catRepository.findOne(id);

    if (!cat) {
      throw new NotFoundException(
        `${id}に一致するデータが見つかりませんでした。`,
      );
    }
    return cat;
  }

  /**
   * @summary 該当ID更新
   * @param id
   */
  async update(id: number, updateCatDto: UpdateCatDto): Promise<UpdateResult> {
    {
      return await this.catRepository
        .update(id, { name: updateCatDto.name })
        .catch((e) => {
          throw new InternalServerErrorException(e.message);
        });
    }
  }

  /**
   * @summary 削除
   * @param id
   */
  async remove(id: number): Promise<DeleteResult> {
    return await this.catRepository.delete(id).catch((e) => {
      throw new InternalServerErrorException(e.message);
    });
  }
}
