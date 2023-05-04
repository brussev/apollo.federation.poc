import { Inject, Injectable } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { and, CreateOptions, FindOptions, Op, or, Sequelize } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Sorting, GenericFilter, Pagination, DeleteResult } from '../types/shared.graphql';
import { INTERNAL_SERVER_ERROR } from './constants';
import DataLoader = require('dataloader');

export type Constructor<T> = new (...args: any[]) => T;
export type ModelType<T extends Model> = Constructor<T> & typeof Model;

export interface BaseManyReturnResult<T> {
    entities: T[];
    cursor: number;
    hasNextPage: boolean;
}

@Injectable()
export class BaseService<T extends Model> {
    private readonly dataloader: DataLoader<string, T[]>;

    constructor(private model: ModelType<T>) {
        this.dataloader = new DataLoader<string, T[]>(async (ids: string[]) => await this.batchLoad(ids), {
            cache: false
        });
    }

    /**
     * Find all function which search for values in elastic cache or database
     */
    async findAll(filters: GenericFilter[], paging: Pagination = { size: 1000 }, sorting?: Sorting[]): Promise<BaseManyReturnResult<T>> {
        try {
            paging.cursor = paging.cursor || 0;
            paging.size = paging.size || 1000;

            const result = { entities: [], cursor: 0, hasNextPage: false };

            let dbFilters: FindOptions = {
                where: { deleted: null },
                limit: paging.size + 1,
                offset: paging.cursor,
                order: sorting ? sorting.map((x) => [x.column, x.orderDirection]) : [['created', 'DESC']]
            };

            if (filters) {
                dbFilters = this.getDatabaseFilters(filters, dbFilters);
            }

            result.entities = await this.model.findAll(dbFilters);

            // Check if the query returns entities and if there is a size parameter passed from the user
            if (result.entities.length) {
                // If the return array length is higher than the size request from the user, there are more entities
                if (result.entities.length > paging.size) {
                    result.hasNextPage = true;
                    result.entities.splice(-1, 1);
                }

                result.cursor = paging.cursor + result.entities.length;
            }

            return result;
        } catch (err) {
            throw new ApolloError(err, err.code || (err.extensions && err.extensions.code) || INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Find one function which search for specific entity in elastic cache or database depending if the entity is stored in elastic
     */
    async findByPk(id: string): Promise<T> {
        let result = null;

        if (id) {
            try {
                result = await this.dataloader.load(id);
            } catch (err) {
                throw new ApolloError(err, err.code || (err.extensions && err.extensions.code) || INTERNAL_SERVER_ERROR);
            }
        }

        return result;
    }

    async create(modelCreateValues: any, options?: CreateOptions): Promise<T> {
        let result = await this.model.create(
            {
                id: uuidv4(),
                modifiedBy: 'boyanbitte',
                ...modelCreateValues
            },
            options
        );
        result = result.get({ plain: true });

        return result;
    }

    async update(modelUpdateValues: any, options?: CreateOptions): Promise<T> {
        try {
            const entity = await this.model.findByPk(modelUpdateValues.id);

            const updateResult = await entity.update(
                {
                    modifiedBy: 'boyan_bitte',
                    ...modelUpdateValues
                },
                options
            );

            const result = updateResult.get({ plain: true });

            this.dataloader.clear(result.id);

            return result;
        } catch (err) {
            throw new ApolloError(err, err.extensions && err.extensions.code ? err.extensions.code : INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: string, filterColumn = 'id'): Promise<DeleteResult> {
        const filter = {
            [filterColumn as T['_attributes']]: id
        };

        try {
            const item: any = await this.model.findOne({ where: filter });

            await item.update({
                modifiedBy: 'boyan'
            });

            await item.destroy();

            await item.save();

            this.dataloader.clear(item.id);

            return { success: item ? true : false, id: id, message: '' };
        } catch (err) {
            throw new ApolloError(err, err.extensions && err.extensions.code ? err.extensions.code : INTERNAL_SERVER_ERROR);
        }
    }

    getDatabaseFilters(filters: GenericFilter[], currentFilters: FindOptions, filterOperatorType?: string): FindOptions {
        const filtersArray: any = [];

        filters.forEach((filter) => {
            switch (filter.type) {
                case 'EQ':
                    filtersArray.push({ [filter.key]: { [Op.eq]: filter.value } });
                    break;
                case 'NE':
                    filtersArray.push({ [filter.key]: { [Op.ne]: filter.value } });
                    break;
                case 'LT':
                    filtersArray.push({ [filter.key]: { [Op.lt]: filter.value } });
                    break;
                case 'GT':
                    filtersArray.push({ [filter.key]: { [Op.gt]: filter.value } });
                    break;
                case 'LIKE':
                    filtersArray.push({ [filter.key]: { [Op.iLike]: `%${filter.value.toLowerCase()}%` } });
                    break;
                case 'IN':
                    filtersArray.push({ [filter.key]: { [Op.in]: filter.value.split(',').map((e) => e.trim()) } });
                    break;
                case 'NOTIN':
                    filtersArray.push({ [filter.key]: { [Op.notIn]: filter.value.split(',').map((e) => e.trim()) } });
                    break;
            }
        });

        const queryObject = filterOperatorType == 'OR' ? or(...filtersArray) : and(...filtersArray);

        return { ...currentFilters, where: { ...currentFilters.where, ...queryObject } };
    }

    async batchLoad(ids: string[]): Promise<any> {
        let items = null;

        items = await this.model.findAll({ where: { id: ids, deleted: null }, raw: true });

        return ids.map((key) => items.find((item) => item.id == key));
    }
}
