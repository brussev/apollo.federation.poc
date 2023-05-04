import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { BaseService, ModelType } from '../common/base.service';
import { Farm } from './farm.entity';

@Injectable()
export class FarmService extends BaseService<Farm> {
    constructor(@InjectModel(Farm) model: ModelType<Farm>) {
        super(model);
    }
}
