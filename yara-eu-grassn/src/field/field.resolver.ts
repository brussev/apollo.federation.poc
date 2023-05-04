import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { DeleteResult, FilterType, FindManyArgs } from '../types/shared.graphql';
import { FieldService } from './field.service';
import { FarmField, FarmFieldInput, ManyFarmFieldResult } from './field.entity';

@Resolver(() => FarmField)
export class FieldResolver {
    @Inject()
    fieldService: FieldService;

    @Query(() => ManyFarmFieldResult, { description: 'Query to get all entities depending on given filters' })
    async fields(@Args() args: FindManyArgs): Promise<ManyFarmFieldResult> {
        const result = await this.fieldService.findAll(args.filter, args.paging, args.sorting);

        return result;
    }

    @Query(() => FarmField, { nullable: true, description: 'Query to get single entity depending on the given id' })
    async field(
        @Args({
            type: () => ID,
            name: 'id',
            nullable: false
        })
        id: string
    ): Promise<FarmField> {
        const result = await this.fieldService.findByPk(id);

        return result;
    }

    @Mutation(() => FarmField, { description: 'Update specific entity based on the input' })
    async createFarmField(
        @Args('input')
        input: FarmFieldInput
    ): Promise<FarmField> {
        const result = await this.fieldService.create(input);

        return result;
    }

    @Mutation(() => FarmField, { description: 'Insert specific entity based on the input' })
    async updateFarmField(
        @Args('input')
        input: FarmFieldInput
    ): Promise<FarmField> {
        const result = await this.fieldService.update(input);

        return result;
    }

    @Mutation(() => DeleteResult, { description: 'Soft delete entity based on the given id' })
    async deleteFarmField(
        @Args({
            type: () => ID,
            name: 'id',
            nullable: false
        })
        id: string,
        @Args({
            name: 'filterColumn',
            type: () => String,
            nullable: true
        })
        filterColumn: string
    ): Promise<DeleteResult> {
        const result = await this.fieldService.delete(id, filterColumn);

        return result;
    }

    @ResolveReference()
    async resolveReference(reference: { __typename: string; id: string }): Promise<FarmField> {
        const result = await this.fieldService.findByPk(reference.id);

        return result;
    }
}
