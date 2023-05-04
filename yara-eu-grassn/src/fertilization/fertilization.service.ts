import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { BaseService, ModelType } from '../common/base.service';
import { Fertilization } from './fertilization.entity';

@Injectable()
export class FertilizationService extends BaseService<Fertilization> {
    constructor(@InjectModel(Fertilization) model: ModelType<Fertilization>) {
        super(model);
    }
}
