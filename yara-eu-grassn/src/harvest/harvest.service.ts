import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { BaseService, ModelType } from '../common/base.service';
import { Harvest } from './harvest.entity';

@Injectable()
export class HarvestService extends BaseService<Harvest> {
    constructor(@InjectModel(Harvest) model: ModelType<Harvest>) {
        super(model);
    }
}
