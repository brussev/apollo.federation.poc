import { ArgsType, Field, ID, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum OrderDirection {
    ASC = 'ASC',
    DESC = 'DESC'
}
registerEnumType(OrderDirection, {
    name: 'OrderDirection'
});

export enum FilterType {
    EQ = 'EQ',
    NE = 'NE',
    LT = 'LT',
    GT = 'GT',
    LIKE = 'LIKE',
    IN = 'IN',
    NOTIN = 'NOTIN'
}
registerEnumType(FilterType, {
    name: 'FilterType'
});

export enum OperatorType {
    AND = 'AND',
    OR = 'OR'
}
registerEnumType(OperatorType, {
    name: 'OperatorType'
});

@InputType({ description: 'Filter that applies to the requested data based on the column name and filters' })
export class GenericFilter {
    @Field(() => String, { description: 'Column that will be filtered on' })
    key: string;

    @Field(() => FilterType, { description: 'Filter type' })
    type: FilterType;

    @Field(() => String, { description: 'Filters which will be applied on the specified column' })
    value: string;
}

@InputType()
export class Pagination {
    @Field(() => Int, { nullable: false })
    size: number;

    @Field(() => Int, { nullable: true })
    cursor?: number;
}

@InputType()
export class Sorting {
    @Field(() => String)
    column: string;

    @Field(() => OrderDirection, { defaultValue: OrderDirection.ASC, nullable: true })
    orderDirection?: OrderDirection;
}

@ArgsType()
export class FindManyArgs {
    @Field(() => [GenericFilter], { nullable: 'itemsAndList', defaultValue: [] })
    filter?: GenericFilter[];

    @Field({ nullable: true, defaultValue: { size: 1000 } })
    paging?: Pagination;

    @Field(() => [Sorting], { nullable: 'itemsAndList' })
    sorting?: Sorting[];

    @Field(() => OperatorType, { nullable: true, description: 'Supported filter operators for joining the filters' })
    filterOperatorType?: OperatorType;
}

@ObjectType()
export class BaseManyReturnGraphQLResult {
    @Field(() => Int, { nullable: true })
    cursor: number;

    @Field(() => Boolean, { nullable: true })
    hasNextPage: boolean;
}

@ObjectType({ description: 'Delete result structure' })
export class DeleteResult {
    @Field({ nullable: false })
    id: string;

    @Field({ nullable: true })
    message?: string;

    @Field({ nullable: false })
    success: boolean;
}

@ObjectType({ description: 'Bulk delete result structure' })
export class BulkDeleteResult {
    @Field(() => [String], { nullable: 'itemsAndList' })
    ids?: string[];

    @Field({ nullable: true })
    message?: string;

    @Field({ nullable: false })
    success: boolean;
}
