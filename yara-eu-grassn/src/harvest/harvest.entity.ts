import { Column, Model, PrimaryKey, DataType, Table } from 'sequelize-typescript';
import { Directive, Field, Float, ID, InputType, ObjectType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { BaseManyReturnGraphQLResult } from '../types/shared.graphql';

@ObjectType({ description: 'Returned response from queries' })
@Table({
    freezeTableName: true,
    paranoid: true,
    tableName: 'Harvest',
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted'
})
@Directive('@key(fields: "id")')
export class Harvest extends Model<Harvest> {
    @PrimaryKey
    @Column(DataType.UUID)
    @Field(() => ID, { description: 'Entity unique identifier' })
    id: string;

    @Column({ type: DataType.UUID })
    @Field({ nullable: false, description: 'Name of the crop class' })
    farmId: string;

    @Column({ type: DataType.UUID })
    @Field({ nullable: false, description: 'Name of the crop class' })
    fieldId: string;

    @Column({ type: DataType.DATE })
    @Field({ nullable: false, description: 'Name of the crop class' })
    date: string;

    @Column({ type: DataType.TEXT })
    @Field({ nullable: false, description: 'Name of the crop class' })
    crudeProteinContent: string;

    @Column({ type: DataType.TEXT })
    @Field({ nullable: false, description: 'Name of the crop class' })
    dryMatterYield: string;

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
export class HarvestInput {
    @Field(() => ID, { nullable: true, description: 'Entity unique identifier' })
    id?: string;

    @Field({ nullable: false, description: 'Name of the crop class' })
    name: string;
}

@ObjectType()
export class ManyHarvestResult extends BaseManyReturnGraphQLResult {
    @Field(() => [Harvest])
    entities: Harvest[];
}
