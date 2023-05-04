import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { BaseService, ModelType } from '../common/base.service';
import { FarmField } from './field.entity';

@Injectable()
export class FieldService extends BaseService<FarmField> {
    constructor(@InjectModel(FarmField) model: ModelType<FarmField>) {
        super(model);
    }
}
