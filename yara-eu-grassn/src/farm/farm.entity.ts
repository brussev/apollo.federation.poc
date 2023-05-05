import { Column, Model, PrimaryKey, DataType, Table } from 'sequelize-typescript';
import { Directive, Field, Float, ID, InputType, ObjectType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { BaseManyReturnGraphQLResult } from '../types/shared.graphql';

@ObjectType({ description: 'Returned response from queries' })
@Table({
    freezeTableName: true,
    paranoid: true,
    tableName: 'Farm',
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted'
})
@Directive('@key(fields: "id")')
export class Farm extends Model<Farm> {
    @PrimaryKey
    @Column(DataType.UUID)
    @Field(() => ID, { description: 'Entity unique identifier' })
    id: string;

    @Column({ type: DataType.STRING(200) })
    @Field({ nullable: false, description: 'Name of the farm' })
    name: string;

    @Column({ type: DataType.UUID })
    @Field({ nullable: false, description: 'id of the organisation' })
    organizationId: string;

    @Column({ type: DataType.UUID })
    @Field({ nullable: false, description: 'id of the country' })
    countryId: string;

    @Column(DataType.DATE)
    @Field({ nullable: false, description: 'Date of creation' })
    created: Date;

    @Column(DataType.DATE)
    @Field({ nullable: false, description: 'Last date of modification' })
    modified: Date;

    @Column(DataType.STRING(150))
    @Field({ nullable: false, defaultValue: 'admin@yara.com', description: 'User who made last modification' })
    modifiedBy: string;

    @Column(DataType.DATE)
    @Field({ nullable: true, description: 'Date of deletion' })
    deleted: Date;
}

@InputType({ description: 'Request details for insert and updates' })
export class FarmInput {
    @Field(() => ID, { nullable: true, description: 'Entity unique identifier' })
    id?: string;

    @Field({ nullable: false, description: 'Name of the farm' })
    name: string;
}

@ObjectType()
export class ManyFarmResult extends BaseManyReturnGraphQLResult {
    @Field(() => [Farm])
    entities: Farm[];
}
