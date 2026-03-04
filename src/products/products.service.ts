import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';

type Product = CreateProductDto & {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  create(createProductDto: CreateProductDto): Product {
    const product: Product = {
      id: this.products.length + 1,
      ...createProductDto,
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    const updatedProduct: Product = {
      ...this.products[productIndex],
      ...updateProductDto,
      updatedAt: new Date(),
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  remove(id: number, deleteProductDto: DeleteProductDto): Product {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1)
      throw new NotFoundException(`Product #${id} not found`);

    if (!deleteProductDto.confirmDelete) {
      throw new BadRequestException('Deletion not confirmed');
    }

    const deletedProduct: Product = {
      ...this.products[productIndex],
      ...deleteProductDto,
      deletedAt: new Date(),
    };

    this.products.splice(productIndex, 1);
    return deletedProduct;
  }
}
