import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { BaseService, ModelType } from '../common/base.service';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationService extends BaseService<Organization> {
    constructor(@InjectModel(Organization) model: ModelType<Organization>) {
        super(model);
    }
}
