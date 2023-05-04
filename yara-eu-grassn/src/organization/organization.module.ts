import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommonModule } from '../common/common.module';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';
import { Organization } from './organization.entity';

@Module({
    imports: [SequelizeModule.forFeature([Organization]), CommonModule],
    providers: [OrganizationService, OrganizationResolver],
    exports: [OrganizationService]
})
export class OrganizationModule {}
