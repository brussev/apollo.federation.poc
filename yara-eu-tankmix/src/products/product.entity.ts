import { Directive, Field, Float, ID, InputType, ObjectType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { BaseManyReturnGraphQLResult } from '../types/shared.graphql';

@ObjectType({ description: 'Returned response from queries' })
@Directive('@key(fields: "id")')
export class Product {
    @Field(() => ID, { description: 'Entity unique identifier' })
    id: string;

    @Field({ nullable: false, description: 'Name of the crop class' })
    name: string;

    @Field({ nullable: false, description: 'Yara by default?' })
    type: string;

    // TBD probably this should be different type as magic strings for countries is a bad practice
    @Field({ nullable: false, description: 'Countries' })
    countries: string;

    @Field({ nullable: false, description: 'deprecated?' })
    deprecated: boolean;

    @Field({ nullable: false, description: 'Date of creation' })
    created?: Date;

    @Field({ nullable: false, description: 'Last date of modification' })
    modified?: Date;

    @Field({ nullable: false, defaultValue: 'admin@yara.com', description: 'User who made last modification' })
    modifiedBy?: string;

    @Field({ nullable: true, description: 'Date of deletion' })
    deleted?: Date;
}

@ObjectType()
export class ManyProductResult extends BaseManyReturnGraphQLResult {
    @Field(() => [Product])
    entities: Product[];
}
