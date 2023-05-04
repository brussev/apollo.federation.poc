import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Module({
    imports: [CommonModule],
    providers: [ProductService, ProductResolver],
    exports: [ProductService]
})
export class ProductModule {}
