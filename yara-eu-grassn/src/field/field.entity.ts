import { Column, Model, PrimaryKey, DataType, Table } from 'sequelize-typescript';
import { Directive, Field, Float, ID, InputType, ObjectType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { BaseManyReturnGraphQLResult } from '../types/shared.graphql';

@ObjectType({ description: 'Returned response from queries' })
@Table({
    freezeTableName: true,
    paranoid: true,
    tableName: 'Field',
    createdAt: 'created',
    updatedAt: 'modified',
    deletedAt: 'deleted'
})
@Directive('@key(fields: "id")')
export class FarmField extends Model<FarmField> {
    @PrimaryKey
    @Column(DataType.UUID)
    @Field(() => ID, { description: 'Entity unique identifier' })
    id: string;

    @Column({ type: DataType.STRING(200) })
    @Field({ nullable: false, description: 'Name of the farm' })
    name: string;

    @Column({ type: DataType.UUID })
    @Field({ nullable: false, description: 'farm id of the field' })
    farmId: string;

    @Column({ type: DataType.DECIMAL })
    @Field({ nullable: false, description: 'area of the field' })
    area: number;

    // @Column({ type: DataType.JSONB })
    // @Field({ nullable: false, description: 'norms of the field' })
    // norms: string; // need to add graphql json type

    // @Column({ type: DataType.JSONB })
    // @Field({ nullable: false, description: 'defaults of the field' })
    // defaults: string; // need to add graphql json type

    // @Column({ type: DataType.JSONB })
    // @Field({ nullable: false, description: 'location of the field' })
    // location: string; // need to add graphql json type

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
export class FarmFieldInput {
    @Field(() => ID, { nullable: true, description: 'Entity unique identifier' })
    id?: string;

    @Field({ nullable: false, description: 'Name of the crop class' })
    name: string;
}

@ObjectType()
export class ManyFarmFieldResult extends BaseManyReturnGraphQLResult {
    @Field(() => [FarmField])
    entities: FarmField[];
}
