import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { DeleteResult, FilterType, FindManyArgs } from '../types/shared.graphql';
import { HarvestService } from './harvest.service';
import { Harvest, HarvestInput, ManyHarvestResult } from './harvest.entity';

@Resolver(() => Harvest)
export class HarvestResolver {
    @Inject()
    harvestService: HarvestService;

    @Query(() => ManyHarvestResult, { description: 'Query to get all entities depending on given filters' })
    async harvests(@Args() args: FindManyArgs): Promise<ManyHarvestResult> {
        const result = await this.harvestService.findAll(args.filter, args.paging, args.sorting);

        return result;
    }

    @Query(() => Harvest, { nullable: true, description: 'Query to get single entity depending on the given id' })
    async harvest(
        @Args({
            type: () => ID,
            name: 'id',
            nullable: false
        })
        id: string
    ): Promise<Harvest> {
        const result = await this.harvestService.findByPk(id);

        return result;
    }

    @Mutation(() => Harvest, { description: 'Update specific entity based on the input' })
    async createHarvest(
        @Args('input')
        input: HarvestInput
    ): Promise<Harvest> {
        const result = await this.harvestService.create(input);

        return result;
    }

    @Mutation(() => Harvest, { description: 'Insert specific entity based on the input' })
    async updateHarvest(
        @Args('input')
        input: HarvestInput
    ): Promise<Harvest> {
        const result = await this.harvestService.update(input);

        return result;
    }

    @Mutation(() => DeleteResult, { description: 'Soft delete entity based on the given id' })
    async deleteHarvest(
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
        const result = await this.harvestService.delete(id, filterColumn);

        return result;
    }

    @ResolveReference()
    async resolveReference(reference: { __typename: string; id: string }): Promise<Harvest> {
        const result = await this.harvestService.findByPk(reference.id);

        return result;
    }
}
