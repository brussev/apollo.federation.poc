import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { DeleteResult, FilterType, FindManyArgs } from '../types/shared.graphql';
import { FertilizationService } from './fertilization.service';
import { Fertilization, FertilizationInput, ManyFertilizationResult } from './fertilization.entity';

@Resolver(() => Fertilization)
export class FertilizationResolver {
    @Inject()
    fertilizationService: FertilizationService;

    @Query(() => ManyFertilizationResult, { description: 'Query to get all entities depending on given filters' })
    async fertilizations(@Args() args: FindManyArgs): Promise<ManyFertilizationResult> {
        const result = await this.fertilizationService.findAll(args.filter, args.paging, args.sorting);

        return result;
    }

    @Query(() => Fertilization, { nullable: true, description: 'Query to get single entity depending on the given id' })
    async fertilization(
        @Args({
            type: () => ID,
            name: 'id',
            nullable: false
        })
        id: string
    ): Promise<Fertilization> {
        const result = await this.fertilizationService.findByPk(id);

        return result;
    }

    @Mutation(() => Fertilization, { description: 'Update specific entity based on the input' })
    async createFertilization(
        @Args('input')
        input: FertilizationInput
    ): Promise<Fertilization> {
        const result = await this.fertilizationService.create(input);

        return result;
    }

    @Mutation(() => Fertilization, { description: 'Insert specific entity based on the input' })
    async updateFertilization(
        @Args('input')
        input: FertilizationInput
    ): Promise<Fertilization> {
        const result = await this.fertilizationService.update(input);

        return result;
    }

    @Mutation(() => DeleteResult, { description: 'Soft delete entity based on the given id' })
    async deleteFertilization(
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
        const result = await this.fertilizationService.delete(id, filterColumn);

        return result;
    }

    @ResolveReference()
    async resolveReference(reference: { __typename: string; id: string }): Promise<Fertilization> {
        const result = await this.fertilizationService.findByPk(reference.id);

        return result;
    }
}
