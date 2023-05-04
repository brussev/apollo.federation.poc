import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { GenericFilter, Pagination, Sorting } from '../types/shared.graphql';
import { ManyProductResult, Product } from './product.entity';

@Injectable()
export class ProductService {
    findAllProducts(filters: GenericFilter[], paging: Pagination, sorting: Sorting[]): ManyProductResult {
        console.log('Here I will give you all the products.');
        const productMock = {
            id: '123',
            name: 'Boyan',
            countries: 'Bulgaria,Germany',
            type: 'Yara',
            deprecated: true
        } as Product;

        return {
            entities: [productMock],
            cursor: 1,
            hasNextPage: false
        };
    }

    findProduct(id: string): Product {
        console.log('Here I will give you specific product');

        const productMock = {
            id: '123',
            name: 'Boyan',
            countries: 'Bulgaria,Germany',
            type: 'Yara',
            deprecated: true
        } as Product;

        return productMock;
    }
}
