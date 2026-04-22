import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { categoryId, ...productData } = createProductDto;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productRepository.create({
      ...productData,
      owner: user,
      category: category,
    });
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['owner', 'category'],
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['owner', 'category'],
    });
  }

  async update(
    id: number,
    updateProductDto: Partial<CreateProductDto>,
    user: User,
  ) {
    const product = await this.productRepository.findOne({
      where: { id, owner: { id: user.id } },
    });

    if (!product) {
      throw new NotFoundException('Product not found or not owned by user');
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number, user: User) {
    const product = await this.productRepository.findOne({
      where: { id, owner: { id: user.id } },
    });

    if (!product) {
      throw new NotFoundException('Product not found or not owned by user');
    }

    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }
}
