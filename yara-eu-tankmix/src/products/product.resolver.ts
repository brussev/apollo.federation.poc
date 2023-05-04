import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { DeleteResult, FilterType, FindManyArgs } from '../types/shared.graphql';
import { ProductService } from './product.service';
import { Product, ManyProductResult } from './product.entity';

@Resolver(() => Product)
export class ProductResolver {
    @Inject()
    productService: ProductService;

    @Query(() => ManyProductResult, { description: 'Query to get all entities depending on given filters' })
    async getProducts(@Args() args: FindManyArgs): Promise<ManyProductResult> {
        const result = await this.productService.findAllProducts(args.filter, args.paging, args.sorting);

        return result;
    }

    @Query(() => Product, { nullable: true, description: 'Query to get single entity depending on the given id' })
    async getProduct(
        @Args({
            type: () => ID,
            name: 'id',
            nullable: false
        })
        id: string
    ): Promise<Product> {
        const result = await this.productService.findProduct(id);

        return result;
    }

    @ResolveReference()
    async resolveReference(reference: { __typename: string; id: string }): Promise<Product> {
        const result = await this.productService.findProduct(reference.id);

        return result;
    }
}
