import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { DeleteResult, FilterType, FindManyArgs } from '../types/shared.graphql';
import { FarmService } from './farm.service';
import { Farm, FarmInput, ManyFarmResult } from './farm.entity';

@Resolver(() => Farm)
export class FarmResolver {
    @Inject()
    farmService: FarmService;

    @Query(() => ManyFarmResult, { description: 'Query to get all entities depending on given filters' })
    async farms(@Args() args: FindManyArgs): Promise<ManyFarmResult> {
        const result = await this.farmService.findAll(args.filter, args.paging, args.sorting);

        return result;
    }

    @Query(() => Farm, { nullable: true, description: 'Query to get single entity depending on the given id' })
    async farm(
        @Args({
            type: () => ID,
            name: 'id',
            nullable: false
        })
        id: string
    ): Promise<Farm> {
        const result = await this.farmService.findByPk(id);

        return result;
    }

    @Mutation(() => Farm, { description: 'Update specific entity based on the input' })
    async createFarm(
        @Args('input')
        input: FarmInput
    ): Promise<Farm> {
        const result = await this.farmService.create(input);

        return result;
    }

    @Mutation(() => Farm, { description: 'Insert specific entity based on the input' })
    async updateFarm(
        @Args('input')
        input: FarmInput
    ): Promise<Farm> {
        const result = await this.farmService.update(input);

        return result;
    }

    @Mutation(() => DeleteResult, { description: 'Soft delete entity based on the given id' })
    async deleteFarm(
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
        const result = await this.farmService.delete(id, filterColumn);

        return result;
    }

    @ResolveReference()
    async resolveReference(reference: { __typename: string; id: string }): Promise<Farm> {
        const result = await this.farmService.findByPk(reference.id);

        return result;
    }
}
