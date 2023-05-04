import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { DeleteResult, FilterType, FindManyArgs } from '../types/shared.graphql';
import { OrganizationService } from './organization.service';
import { Organization, OrganizationInput, ManyOrganizationResult } from './organization.entity';

@Resolver(() => Organization)
export class OrganizationResolver {
    @Inject()
    organizationService: OrganizationService;

    @Query(() => ManyOrganizationResult, { description: 'Query to get all entities depending on given filters' })
    async organizations(@Args() args: FindManyArgs): Promise<ManyOrganizationResult> {
        const result = await this.organizationService.findAll(args.filter, args.paging, args.sorting);

        return result;
    }

    @Query(() => Organization, { nullable: true, description: 'Query to get single entity depending on the given id' })
    async organization(
        @Args({
            type: () => ID,
            name: 'id',
            nullable: false
        })
        id: string
    ): Promise<Organization> {
        const result = await this.organizationService.findByPk(id);

        return result;
    }

    @Mutation(() => Organization, { description: 'Update specific entity based on the input' })
    async createOrganization(
        @Args('input')
        input: OrganizationInput
    ): Promise<Organization> {
        const result = await this.organizationService.create(input);

        return result;
    }

    @Mutation(() => Organization, { description: 'Insert specific entity based on the input' })
    async updateOrganization(
        @Args('input')
        input: OrganizationInput
    ): Promise<Organization> {
        const result = await this.organizationService.update(input);

        return result;
    }

    @Mutation(() => DeleteResult, { description: 'Soft delete entity based on the given id' })
    async deleteOrganization(
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
        const result = await this.organizationService.delete(id, filterColumn);

        return result;
    }

    @ResolveReference()
    async resolveReference(reference: { __typename: string; id: string }): Promise<Organization> {
        const result = await this.organizationService.findByPk(reference.id);

        return result;
    }
}
