import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const product = this.productRepository.create({
      ...createProductDto,
      owner: user,
    });
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ['owner'] });
  }

  async findOne(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['owner'],
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
